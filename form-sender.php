<?php
$From_Email_Adress = 'email@domain.com';
$From_Name = 'Federal One Page Theme';
$To_Email_Adress = 'email@domain.com';
$rb_subject  = 'Online Form from Web Site';



$re = array();
	
$rb_form = '<table cellspacing="1" cellpadding="2" border="0">'."\n";

foreach($_POST as $key => $value)
	$rb_form .= "<tr>\n\t<td valign=\"top\">".$key."</td>\n\t<td>".htmlspecialchars($value)."</td>\n</tr>";

$rb_form .= '</table>';

// To send HTML mail, the Content-type header must be set
$rb_headers  = 'MIME-Version: 1.0' . "\r\n";
$rb_headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$rb_headers .= 'From: '.$From_Name." <".$From_Email_Adress.">\r\n";

// Mail it
$rb_result = mail($To_Email_Adress, $rb_subject, $rb_form, $rb_headers);

if($rb_result)
	$re  = array( 'status'=>'OK', 'message'=> 'Your message has been sent successfully.' );
else
	$re  = array( 'status'=>'NOK', 'error'=> 'Have got an error while sending e-mail.' );

echo json_encode($re);
exit;
?>