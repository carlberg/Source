<?php

/****
 * check whether a value is present in $_POST superglobal and returns it
 * returns false if the value is not found in the array
 *
 */
function post($name)
{
	return(isset($_POST[$name]) ? $_POST[$name] : false);
}

?>
