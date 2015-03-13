<?php
require("smtp-mailer/class.phpmailer.php");
$mail = new PHPMailer();

$rb_form = '<table cellspacing="1" cellpadding="2" border="0">'."\n";

foreach($_POST as $key => $value)
	$rb_form .= "<tr>\n\t<td valign=\"top\">".$key."</td>\n\t<td>".htmlspecialchars($value)."</td>\n</tr>";

$rb_form .= '</table>';

$mail->IsSMTP();  
$mail->Host     = "mail.domain.com"; // SMTP servers
$mail->SMTPAuth = true; 
$mail->Username = "yourmail@domain.com";  // SMTP username
$mail->Password = "password"; // SMTP password

$mail->From     =  "frommail@domain.com"; // sender email
$mail->Fromname =  "Sender Name"; // sender name
$mail->AddAddress("receivermail@domain.com","Receiver name"); // to e-mail and name
$mail->Subject  =  "Web site contact form"; // subject of the contact form

$mail->IsHTML(true);
$mail->Body     =  $rb_form;


$re = array();
	
// Mail it
if($mail->Send())
	$re  = array( 'status'=>'OK', 'message'=> 'Your message has been sent successfully.' );
else
	$re  = array( 'status'=>'NOK', 'error'=> 'Have got an error while sending e-mail.' );

echo json_encode($re);
exit;
?>