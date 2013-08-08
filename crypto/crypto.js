function decipher() {

  var ciphertext = $("#ciphertext")[0].value;

  var mappings = read_mappings();

  var plaintext = "";
  for(p in ciphertext) {

    var cipher_letter = ciphertext[p];

    if (mappings[cipher_letter]){
      plaintext = plaintext + mappings[cipher_letter];
    } else {
      plaintext = plaintext + cipher_letter;
    }
    
  };


  $("#plaintext")[0].innerHTML = plaintext;
  
}

function read_mappings() {
  var mappings = {};
  var m_str = $("#mappings")[0].value;

  var m_arr = m_str.split(/[,|\s]+/);
  for(i in m_arr){
    var arr = m_arr[i].split(/:|/);
    mappings[arr[0]] = arr[1];
  }

  return mappings;

}
