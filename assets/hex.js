// Hex class for quick unicode manipulation
var hex = {
    mapping: [['0',0],['1',1],['2',2], ['3',3],['4',4],['5',5],
              ['6',6], ['7',7], ['8',8],['9',9],['A',10], 
              ['B',11], ['C', 12], ['D',13], ['E',14], ['F',15]],
  
    // A simple quotient-remainder method to convert int to hex
    // inputs: any random integer, outputs: the corresponding hexadecimal string
    int_to_hex: function(integer) {
      var quo = Math.floor(integer/16);
      var rem = Math.floor(integer % 16);
      var uni = ""
  
      // when the quotient is greater than 'F' or 15:
      while (quo >= 16) {
        uni = this.mapping[rem][0] + uni;
  
        rem = Math.floor(quo % 16);
        quo = Math.floor(quo/16);      
      };
  
      uni = this.mapping[quo][0] + this.mapping[rem][0] + uni;
      return uni;
    },
  
    // A simple regression method to convert hex to int
    // inputs: any random hexadecimal string, outputs: the corresponding integer
    hex_to_int: function(string) {
      var total = 0;
      var counter = 0;
      for (i=string.length-1; i>=0; i--) {
        var num = string[i];
  
        if (parseInt(num) || num==='0') {
          num =  parseInt(num)*Math.pow(16, counter);
        }
        else {
          for (j=10; j<16; j++) {
            if (this.mapping[j][0] === num) {
              num = this.mapping[j][1]*Math.pow(16, counter);
            }
          }
        }
        total += num;
        counter ++;
      };
  
      return total;
  
    }
  }