/*!
 * gh-graph.js — standalone GitHub contribution graph widget.
 * No dependencies. Renders a GitHub-style contribution calendar for any
 * user into any element, with hover tooltips, a legend, and an optional
 * total-count caption.
 *
 * Quick start (auto-init):
 *   <div id="gh-graph"></div>
 *   <script src="gh-graph.js" data-username="octocat"></script>
 *
 * Or call it yourself:
 *   GitHubGraph.render({ username: "octocat", target: "#gh-graph" });
 *
 * Contribution data comes from the public API at
 * https://github-contributions-api.jogruber.de (no auth token needed).
 */
(function () {
    "use strict";

    var API = "https://github-contributions-api.jogruber.de/v4/";
    var MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    var LIGHT = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
    var DARK = ["#2a2f36", "#0e4429", "#006d32", "#26a641", "#39d353"];

    var cssInjected = false;
    function injectCss() {
        if (cssInjected) return;
        cssInjected = true;
        var style = document.createElement("style");
        style.textContent =
            ".ghgraph{max-width:700px}" +
            ".ghgraph svg.ghgraph-cal{display:block;width:100%;height:auto}" +
            ".ghgraph-month{font-family:Helvetica,Arial,sans-serif;" +
            "font-size:10px;fill:#555}" +
            ".ghgraph--dark .ghgraph-month{fill:#999}" +
            ".ghgraph-legend{display:flex;justify-content:flex-end;" +
            "align-items:center;gap:5px;margin-top:4px;font-size:12px;" +
            "color:#555;font-family:Helvetica,Arial,sans-serif}" +
            ".ghgraph--dark .ghgraph-legend{color:#999}" +
            ".ghgraph-caption{margin-top:6px;font-size:13px;color:#555;" +
            "font-family:Helvetica,Arial,sans-serif}" +
            ".ghgraph--dark .ghgraph-caption{color:#999}" +
            ".ghgraph-caption a{color:inherit}" +
            ".ghgraph-tooltip{position:absolute;opacity:0;visibility:hidden;" +
            "transform:translateY(4px);transition:opacity .15s ease," +
            "transform .15s ease,visibility .15s;background:#24292f;" +
            "color:#fff;font-family:Helvetica,Arial,sans-serif;" +
            "font-size:12px;line-height:1;padding:6px 8px;border-radius:4px;" +
            "white-space:nowrap;pointer-events:none;z-index:10}" +
            ".ghgraph-tooltip.show{opacity:1;visibility:visible;" +
            "transform:translateY(0)}";
        document.head.appendChild(style);
    }

    function resolveTarget(target) {
        if (typeof target === "string") return document.querySelector(target);
        return target || null;
    }

    function fillColors(el, colors) {
        for (var l = 0; l <= 4; l++) {
            var rects = el.querySelectorAll(".ghgraph-l" + l);
            for (var i = 0; i < rects.length; i++)
                rects[i].setAttribute("fill", colors[l]);
        }
    }

    function buildSvg(days, firstDow) {
        var cell = 11,
            step = 14,
            labelH = 16;
        var weeks = Math.ceil((days.length + firstDow) / 7);
        var w = weeks * step - (step - cell);
        var h = 7 * step - (step - cell) + labelH;
        var svg =
            '<svg class="ghgraph-cal" viewBox="0 0 ' + w + " " + h +
            '" role="img" aria-label="GitHub contribution graph">';
        var lastMonth = -1;
        for (var i = 0; i < days.length; i++) {
            var d = days[i];
            var pos = i + firstDow;
            var x = Math.floor(pos / 7) * step;
            var y = (pos % 7) * step + labelH;
            var dt = new Date(d.date + "T00:00:00");
            var m = dt.getMonth();
            /* label a month at its first full week */
            if (m !== lastMonth) {
                if (i > 0 && x < w - 30) {
                    svg +=
                        '<text x="' + (pos % 7 === 0 ? x : x + step) +
                        '" y="10" class="ghgraph-month">' +
                        MONTHS[m] + "</text>";
                }
                lastMonth = m;
            }
            var label =
                (d.count === 1
                    ? "1 contribution"
                    : d.count + " contributions") +
                " on " + MONTHS[m] + " " + dt.getDate() + ", " +
                dt.getFullYear();
            svg +=
                '<rect x="' + x + '" y="' + y +
                '" width="' + cell + '" height="' + cell +
                '" rx="2" class="ghgraph-l' + d.level +
                '" data-label="' + label + '"></rect>';
        }
        return svg + "</svg>";
    }

    function buildLegend() {
        var legend =
            '<span class="ghgraph-legend">Less ' +
            '<svg viewBox="0 0 70 11" width="70" height="11">';
        for (var l = 0; l <= 4; l++) {
            legend +=
                '<rect x="' + l * 14 +
                '" y="0" width="11" height="11" rx="2" class="ghgraph-l' +
                l + '"></rect>';
        }
        return legend + "</svg> More</span>";
    }

    function attachTooltip(svgEl) {
        var tip = document.createElement("div");
        tip.className = "ghgraph-tooltip";
        document.body.appendChild(tip);
        svgEl.addEventListener("mouseover", function (e) {
            var label =
                e.target.getAttribute && e.target.getAttribute("data-label");
            if (!label) return;
            tip.textContent = label;
            /* center the tooltip above the hovered square */
            var box = e.target.getBoundingClientRect();
            var left =
                window.scrollX + box.left + box.width / 2 -
                tip.offsetWidth / 2;
            left = Math.max(
                4,
                Math.min(
                    left,
                    document.documentElement.scrollWidth - tip.offsetWidth - 4
                )
            );
            tip.style.left = left + "px";
            tip.style.top =
                window.scrollY + box.top - tip.offsetHeight - 7 + "px";
            tip.classList.add("show");
        });
        svgEl.addEventListener("mouseout", function () {
            tip.classList.remove("show");
        });
    }

    function render(options) {
        options = options || {};
        var username = options.username;
        var container = resolveTarget(options.target || "#gh-graph");
        if (!username || !container) {
            throw new Error(
                "GitHubGraph.render needs a username and a target element"
            );
        }
        injectCss();
        container.classList.add("ghgraph");

        var theme = options.theme || "auto";
        var dark = false;
        if (theme === "dark") dark = true;
        else if (theme === "auto" && window.matchMedia) {
            var mq = window.matchMedia("(prefers-color-scheme: dark)");
            dark = mq.matches;
            var onChange = function (e) {
                container.classList.toggle("ghgraph--dark", e.matches);
                fillColors(
                    container,
                    options.colors || (e.matches ? DARK : LIGHT)
                );
            };
            if (mq.addEventListener) mq.addEventListener("change", onChange);
        }
        container.classList.toggle("ghgraph--dark", dark);
        var colors = options.colors || (dark ? DARK : LIGHT);

        fetch(API + encodeURIComponent(username) + "?y=last")
            .then(function (r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.json();
            })
            .then(function (data) {
                var days = data.contributions;
                if (!days || !days.length) throw new Error("no data");
                /* pad so the first column starts on Sunday */
                var firstDow = new Date(days[0].date + "T00:00:00").getDay();
                var html = buildSvg(days, firstDow);
                if (options.showLegend !== false) html += buildLegend();
                var total =
                    data.total && data.total.lastYear != null
                        ? data.total.lastYear
                        : null;
                if (options.showTotal !== false && total != null) {
                    html +=
                        '<p class="ghgraph-caption">' + total +
                        ' contributions in the last year · <a href="' +
                        "https://github.com/" + encodeURIComponent(username) +
                        '">github.com/' + username + "</a></p>";
                }
                container.innerHTML = html;
                fillColors(container, colors);
                attachTooltip(container.querySelector("svg"));
                if (typeof options.onTotal === "function" && total != null)
                    options.onTotal(total);
            })
            .catch(function () {
                /* fall back to a static chart image */
                container.innerHTML =
                    '<a href="https://github.com/' +
                    encodeURIComponent(username) + '">' +
                    '<img src="https://ghchart.rshah.org/' +
                    encodeURIComponent(username) + '" ' +
                    'alt="GitHub contribution graph" style="width:100%"></a>';
            });
    }

    window.GitHubGraph = { render: render };

    /* auto-init from the script tag's data attributes */
    var script = document.currentScript;
    if (script && script.getAttribute("data-username")) {
        var init = function () {
            render({
                username: script.getAttribute("data-username"),
                target: script.getAttribute("data-target") || "#gh-graph",
                theme: script.getAttribute("data-theme") || "auto",
            });
        };
        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", init);
        else init();
    }
})();
