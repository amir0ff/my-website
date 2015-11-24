<?php 
//-------------------------------------------------------------------------//
//  Nuked-KlaN - PHP Portal                                                //
//  http://www.nuked-klan.org                                              //
//-------------------------------------------------------------------------//
//  This program is free software. you can redistribute it and/or modify   //
//  it under the terms of the GNU General Public License as published by   //
//  the Free Software Foundation; either version 2 of the License.         //
//-------------------------------------------------------------------------//

if (eregi("block_php.php", $_SERVER['PHP_SELF'])) {
	die ("You cannot open this page directly");
	}


function affich_block_php($blok){
$blok_content=stripslashes($blok['content']);
ob_start();
$blok['content'] = eval("$blok_content");
$blok['content']=ob_get_contents();
ob_end_clean();
$blok['titre']=stripslashes($blok['titre']);
return $blok;
}


function edit_block_php($bid)
{
global $nuked, $language;

$sql=mysql_query("SELECT active, position, titre, module, content, type, nivo, page FROM $nuked[prefix]"._block." WHERE bid ='$bid'"); 
list($active, $position, $titre, $modul, $content, $type, $nivo, $pages) = mysql_fetch_array($sql);
$titre=stripslashes($titre);
$content=stripslashes($content);

if ($active == 1) $checked1="selected";
else if ($active == 2) $checked2="selected";
else if ($active == 3) $checked3="selected";
else $checked0="selected";

echo"	<form method=\"post\" action=\"index.php?file=Admin&page=block\">
	<A HREF=# onClick=\"javascript:window.open('help/".$langname."/block.html','Aides','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=350,height=300');return(false)\">
	<img src=\"help/help.gif\" border=\"0\" alt=\""._HELP."\"></a><center><H3>"._ADMINBLOCK."</H3><center>	
	<table border=\"0\"><tr><td><b>"._TITLE."</b></td><td><b>"._BLOCK."</b></td><td><b>"._POSITION."</b></td><td><b>"._LEVEL."</b></td></tr>
	<tr><td align=\"center\"><input type=\"text\" name=\"titre\" size=\"40\" value=\"$titre\">
	</td><td align=\"center\"><select name=\"active\"><option value=\"1\" $checked1>"._LEFT."</option>
	<option value=\"2\" $checked2>"._RIGHT."</option><option value=\"3\" $checked3>"._CENTERBLOCK."</option>
	<option value=\"0\" $checked0>"._OFF."</option>
	</select></td><td align=\"center\"><input type=\"text\" name=\"position\" size=\"2\" value=\"$position\">
	</td><td><select name=\"nivo\"><option>$nivo</option><option>0</option><option>1</option><option>2</option><option>3</option>
	<option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option>
    	</select></td></tr><tr><td colspan=\"4\">
	<textarea name=\"content\" wrap=true type=\"text\" rows=\"10\" cols=\"70\">$content</textarea>
	</td></tr><tr><td colspan=\"4\" align=\"center\"><b>"._PAGESELECT." : </b><br><br>
	<select name=\"pages[]\" size=\"5\" multiple=\"multiple\">";

	select_mod2($pages);

echo"	</select></td><tr>
	<input type=\"hidden\" name=\"type\" value=\"$type\">
	<input type=\"hidden\" name=\"bid\" value=\"$bid\">
	<input type=\"hidden\" name=\"op\" value=\"modif_block\">
	<tr><td colspan=\"4\" align=\"center\"><br><input type=\"submit\" name=\"send\" value=\""._MODIFBLOCK."\"></td></tr></form><br>
	</table></center><br><center><a href=\"index.php?file=Admin&page=block\"><b>"._BACK."</b></a></center><br>";
	}

?>
