<?php

if (eregi("block_team.php", $_SERVER['PHP_SELF'])) {
	die ("You cannot open this page directly");
	}

global $nuked, $langname,$language;
include ("lang/$language");
list ($langname,,) = split ('[.]', $language);


function affich_block_team($blok){

global $theme, $nuked;
	
	$team = $blok[content];

	$sql = "SELECT * FROM $nuked[prefix]"._team." where cid='$team'";
        $req = mysql_query($sql) or die(""._ERRORSQL."<br>".$sql."<br>".mysql_error());
	$data2 = mysql_fetch_array($req);
	
        $blok[content]="";
	$blok[content] .="<table width=\"90%\" align=\"center\" cellspacing=\"0\" cellpadding=\"0\">";
	
	if($team!=""){
	$result = mysql_query("select * from $nuked[prefix]"._users." where team='$team' ORDER BY niveau DESC");}
	else{
     	$result = mysql_query("select * from $nuked[prefix]"._users." where niveau >1 ORDER BY niveau DESC");}
     	while ($data = mysql_fetch_array($result)){

	if($team!=""){
	$nick_team="$data2[tag]$data[pseudo]";}
	else{$nick_team="$nuked[tag_pre]$data[pseudo]";}
        
 $blok[content] .= "<tr><TD><B><a href=\"index.php?file=Team&op=detail&autor=$data[pseudo]\">$nick_team</a></B></TD>
		    <TD><a href=\"mailto:$data[mail]\"><img src=\"themes/$theme/images/mail.gif\" border=\"0\"></a></TD></tr>";
         }
 $blok[content] .= "</table>";
return $blok;
}


function edit_block_team($bid){

global $nuked, $langname;

$sql="SELECT * FROM $nuked[prefix]"._block." where bid ='$bid'";
$req= mysql_query($sql) or die(""._ERRORSQL."<br>".$sql."<br>".mysql_error()); 

echo"	<form method=\"post\" action=\"index.php?file=Admin&op=block\">
	<A HREF=# onClick=\"javascript:window.open('help/".$langname."/block.html','Help','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=350,height=300');return(false)\"><img src=\"help/help.gif\" border=0 alt=\""._HELP."\"></a><center><H3>"._ADMINBLOCK."</H3><center>	
	<table border=\"0\"><tr><td><b>"._TITLE."</b></td><td><b>"._BLOCK."</b></td><td><b>"._POSITION."</b></td><td><b>"._LEVEL."</b></td></tr>";
	while($data = mysql_fetch_array($req)) 
	{ 
	$active=$data['active'];
	$position=$data['position'];
	$titre=$data['titre'];
	$modul=$data['module'];
	$content=$data['content'];
	$type=$data['type'];
	$nivo=$data['nivo'];

if ($active == 1) $checked1="selected";
else if ($active == 2) $checked2="selected";
else $checked0="selected";

echo"	<tr><td align=\"center\"><input type=\"text\" name=\"titre\" size=\"40\" value=\"$titre\"></td><td align=\"center\">
	<select name=\"active\"><option value=\"1\" $checked1>"._LEFT."</option><option value=\"2\" $checked2>"._RIGHT."</option>
	<option value=\"0\" $checked0>"._OFF."</option></select></td><td align=\"center\">
	<input type=\"text\" name=\"position\" size=\"2\" value=\"$position\"></td><td>
	<input type=\"text\" name=\"nivo\" size=\"1\" value=\"$nivo\"></td></tr>
	</select></td></tr>";

echo "	<tr><td colspan=\"4\"><b>"._TEAM." :</b> <select name=\"content\">
        <option value=\"\">"._ALL."</option>";
	
	$sql2 = "SELECT * FROM $nuked[prefix]"._team."";
        $req2 = mysql_query($sql2) or die(""._ERRORSQL."<br>".$sql2."<br>".mysql_error());
	while($data2 = mysql_fetch_array($req2)){
	$team = $data2['titre'];
	$team_id = $data2['cid'];
	if ($content==$team_id) $checked = "selected";
	else $checked = "";
if($team!=""){
echo "<option value=\"$team_id\" $checked>$team</option>";}
            }

echo"	</select></center></td></tr><tr><td colspan=\"4\" align=\"center\">
	<b>"._PAGESELECT." :</b><br><br>
	<select name=\"page[]\" size=\"5\" multiple=\"multiple\">";

	select_mod2($data[page]);

echo"	</select></td><tr>";
	}

echo"	<input type=\"hidden\" name=\"type\" value=\"$type\">
	<input type=\"hidden\" name=\"bid\" value=\"$bid\">
	<input type=\"hidden\" name=\"req\" value=\"modif_block\">
	<tr><td colspan=\"4\" align=\"center\"><br><input type=\"submit\" name=\"send\" value=\""._MODIFBLOCK."\">
	</td></tr></form><br></table></center><br><center><a href=\"index.php?file=Admin&op=block\"><b>"._BACK."</b>
	</a></center><br>";
	}

?>