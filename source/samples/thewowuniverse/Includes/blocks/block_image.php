<?php 
// -------------------------------------------------------------------------//
// Nuked-KlaN - PHP Portal                                                  //
// http://www.nuked-klan.org                                                //
// -------------------------------------------------------------------------//
// This program is free software. you can redistribute it and/or modify     //
// it under the terms of the GNU General Public License as published by     //
// the Free Software Foundation; either version 2 of the License.           //
// -------------------------------------------------------------------------//
if (eregi("block_image.php", $_SERVER['PHP_SELF']))
{
    die ("You cannot open this page directly");
} 

function affich_block_image($blok)
{
    global $nuked;

    include("modules/Gallery/config.php");

    $sql = mysql_query("SELECT sid, titre, url, url2 FROM " . GALLERY_TABLE . " ORDER BY rand() LIMIT 1");
    list($sid, $titre, $url, $url2) = mysql_fetch_array($sql);
    $titre = stripslashes($titre);
    $titre = htmlentities($titre);

    if ($url2 != "")
    {
        $img = $url2;
    } 
    else
    {
        $img = $url;
    } 

    if (!eregi("%20", $img)) list($w, $h, $t, $a) = @getimagesize($img);
    if ($w != "" && $w <= $img_screen1) $width = "width=\"" . $w . "\"";
    else $width = "width=\"" . $img_screen1 . "\"";
    $image = "<img style=\"border: 1px solid #000000;\" src=\"" . $img . "\" " . $width . " alt=\"\" />";

    if ( $img != "") 
    {
	$blok['content'] = "<div style=\"text-align: center;\"><a href=\"index.php?file=Gallery&amp;op=description&amp;sid=" . $sid . "&orderby=news\"><b>" . $titre . "</b></a></div>\n"
	. "<div style=\"text-align: center;\"><a href=\"index.php?file=Gallery&op=description&sid=" . $sid . "&orderby=news\">" . $image . "</a></div>\n";
    }

    return $blok;
} 

function edit_block_image($bid)
{
    global $nuked, $language;

    $sql = mysql_query("SELECT active, position, titre, module, content, type, nivo, page FROM " . BLOCK_TABLE . " WHERE bid = '" . $bid . "'");
    list($active, $position, $titre, $modul, $content, $type, $nivo, $pages) = mysql_fetch_array($sql);
    $titre = stripslashes($titre);
    $titre = htmlentities($titre);

    if ($active == 1) $checked1 = "selected=\"selected\"";
    else if ($active == 2) $checked2 = "selected=\"selected\"";
    else $checked0 = "selected=\"selected\"";

    echo "<a href=\"#\" onclick=\"javascript:window.open('help/" . $language . "/block.html','Help','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=350,height=300');return(false)\">\n"
    . "<img style=\"border: 0;\" src=\"help/help.gif\" alt=\"\" title=\"" . _HELP . "\" /></a><div style=\"text-align: center;\"><h3>" . _ADMINBLOCK . "</h3></div>\n"
    . "<form method=\"post\" action=\"index.php?file=Admin&amp;page=block&amp;op=modif_block\">\n"
    . "<table style=\"margin-left: auto;margin-right: auto;text-align: left;\" cellspacing=\"0\" cellpadding=\"2\" border=\"0\">\n"
    . "<tr><td><b>" . _TITLE . "</b></td><td><b>" . _BLOCK . "</b></td><td><b>" . _POSITION . "</b></td><td><b>" . _LEVEL . "</b></td></tr>\n"
    . "<tr><td align=\"center\"><input type=\"text\" name=\"titre\" size=\"40\" value=\"" . $titre . "\" /></td>\n"
    . "<td align=\"center\"><select name=\"active\">\n"
    . "<option value=\"1\" " . $checked1 . ">" . _LEFT . "</option>\n"
    . "<option value=\"2\" " . $checked2 . ">" . _RIGHT . "</option>\n"
    . "<option value=\"0\" " . $checked0 . ">" . _OFF . "</option></select></td>\n"
    . "<td align=\"center\"><input type=\"text\" name=\"position\" size=\"2\" value=\"" . $position . "\" /></td>\n"
    . "<td align=\"center\"><select name=\"nivo\"><option>" . $nivo . "</option>\n"
    . "<option>0</option>\n"
    . "<option>1</option>\n"
    . "<option>2</option>\n"
    . "<option>3</option>\n"
    . "<option>4</option>\n"
    . "<option>5</option>\n"
    . "<option>6</option>\n"
    . "<option>7</option>\n"
    . "<option>8</option>\n"
    . "<option>9</option></select></td></tr><tr><td colspan=\"4\">&nbsp;</td></tr>\n"
    . "<tr><td colspan=\"4\" align=\"center\"><b>" . _PAGESELECT . " :</b></td></tr><tr><td colspan=\"4\">&nbsp;</td></tr>\n"
    . "<tr><td colspan=\"4\" align=\"center\"><select name=\"pages[]\" size=\"8\" multiple=\"multiple\">\n";

    select_mod2($pages);

    echo "</select></td></tr><tr><td colspan=\"4\" align=\"center\"><br />\n"
    . "<input type=\"hidden\" name=\"type\" value=\"" . $type . "\" />\n"
    . "<input type=\"hidden\" name=\"bid\" value=\"" . $bid . "\" />\n"
    . "<input type=\"submit\" name=\"send\" value=\"" . _MODIFBLOCK . "\" />\n"
    . "</td></tr></table>\n"
    . "<div style=\"text-align: center;\"><br />[ <a href=\"index.php?file=Admin&amp;page=block\"><b>" . _BACK . "</b></a> ]</div></form><br />\n";

}

?>