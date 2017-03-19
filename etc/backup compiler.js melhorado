function Analex(){

    this.symbolTable = []; //Array Tokens
    
    this.tokenizer = function(codeText){
    }
}

function Anasint(){}

function Compiler(){

    this.codeText;
    this.analex  = new Analex();
    this.anasint = new Anasint();
    
    // Function witch runs evetime a Key is pressed.
    this.runOnKeyUp = function(){

        console.log( codeText.toString() );

        this.analex.tokenizer(codeText);

    }
}

function Token(){
    this.value = "";
    this.class_match = "";
    this.last_class_match = "";
    this.positions = [];

    this.clean = function(){
        this.value = "";
        this.class_match = "";
        this.last_class_match = "";
        this.positions = [];
    }
}

function Position(){
    this.row;
    this.col;
}

function CodeText(){
    
    //Array Row
    var rows = []; 

    this.row = function(i) {
        if(rows[i-1] == undefined)
            throw new Error("[NUMERO DA LINHA][ " + i + " ] solicitada não existe nesse objeto CodeText.");
        else 
            return rows[i-1];
    } 

    this.rowAt = function(i) {
        if(rows[i] == undefined)
            throw new Error("[INDEX DA LINHA][ " + i + " ] solicitada não existe nesse objeto CodeText.");
        else 
            return rows[i];
    } 

    this.pushRow = function(number, text) {
        rows.push( new Row(number, text) );
    }

    this.rowsCount = function() {
        return rows.length;
    } 

    this.toString = function() {
        var string = "";
        var qtdRows = this.rowsCount();

        for (var i = 0; i < qtdRows; i++) {
            string += rowAt(i).text; 
            if( i < qtdRows-1 )
                string += "\n";      
        }
        return string;
    }

    this.isOutOfIndex = function(i,j) {

        var lastRowIndex = rowsCount()-1;

        if(i < 0 || i > lastRowIndex)
            return true;
        
        var lastColIndex = rowAt(i).length()-1;

        if(j < 0 || j > lastColIndex)
            return true;

        return false;
    }

    this.isOutOfFile = function(i,j) {

        var lastRowPosition = rowsCount();

        if(i < 1 || i > lastRowPosition)
            return true;
        
        var lastColPosition = row(i).length();

        if(j < 1 || j > lastColPosition)
            return true;

        return false;
    }
}

function Row(n, t){
    
    this.number = n || 0;
    this.text   = t || "";

    this.length = function() {
        return this.text.length;
    }

    this.col = function(i) {
        if(rows[i-1] == undefined)
            throw new Error("[NUMERO DA COLUNA][ " + i + " ] solicitada não existe nesse objeto ROW.");
        else 
            return rows[i-1];
    } 

    this.colAt = function(i) {
        if(rows[i] == undefined)
            throw new Error("[INDEX DA COLUNA][ " + i + " ] solicitada não existe nesse objeto ROW.");
        else 
            return rows[i];
    }  

}