<?php
require_one('helpers/common.php');
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="Content-Language" content="en" />
	<meta name="GENERATOR" content="PHPEclipse 1.2.0" />
	<title>BTS Cellfile Converter</title>
</head>
<body>

<h1>BTS Cellfile Converter<h1/>
	<form action="index.php" method="post" enctype="multipart/form-data">
	<fieldset>
	<legend>Upload cellfile to be converted</legend>

		<label for="file">Filename:</label>
		<input type="file" name="file" id="file" />
		<input type="submit" name="submit" value="Upload" />
	</fieldset>

	</form>

</body>
</html>
