#pragma strict
import System.Security.Cryptography;

static function md5Sum(strToEncrypt: String)
{
/*
            MD5 md5 = MD5.Create();

            byte[] data = md5.ComputeHash(Encoding.Default.GetBytes(strToEncrypt));

            StringBuilder sBuilder = new StringBuilder();

            for (int i = 0; i < data.Length; i++)
                sBuilder.Append(data[i].ToString("x2"));

            return sBuilder.ToString();
*/

	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(strToEncrypt);

 
 
	// encrypt bytes

	var md5:MD5 = MD5.Create(); // System.Security.Cryptography.MD5CryptoServiceProvider()
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);

}