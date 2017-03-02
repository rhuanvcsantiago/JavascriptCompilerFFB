function Compiler(codeObject){

    this.code = codeObject;
}

function lexicalAnaliser(){}

function Code(){

    // a code is a composition of rows
    this.rows = [];   
    
    // return a row object
    this.getRow = function(rowNumber){
        return this.rows[rowNumber-1];
    }

    this.pushRow = function(number, text){
        this.rows.push( new Row(number, text) );
    }
    
    // especial characters included
    // return the total of characters of all the code
    this.caractersLength = function(){
        var count = 0;
        for (var i = 0; i < this.rowsCount(); i++) {
            count += this.rows[i].text.length;      
        }
    }

    // count of the total of rows of the code
    this.rowsCount = function(){
        return this.rows.length;
    }

    this.toString = function(){
        var string = "";
        for (var i = 0; i < this.rowsCount(); i++) {
            string += this.rows[i].text + "\n";      
        }
        return string;
    }

}

// a row
function Row(number, text){
    this.number = number;
    this.text = text;
}