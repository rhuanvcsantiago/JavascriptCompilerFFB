function CodeFile(){
    
    //Array Row
    var codeRows = []; 

    this.row = function(i) {
        if(codeRows[i-1] == undefined)
            throw new Error("[NUMERO DA LINHA][ " + i + " ] solicitada não existe nesse objeto CodeText.");
        else 
            return codeRows[i-1];
    } 

    this.rowAt = function(i) {
        if(codeRows[i] == undefined)
            throw new Error("[INDEX DA LINHA][ " + i + " ] solicitada não existe nesse objeto CodeText.");
        else 
            return codeRows[i];
    } 

    this.pushRow = function(number, text) {
        codeRows.push( new CodeRow(number, text) );
    }

    this.rowsCount = function() {
        return codeRows.length;
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

    this.isEmpty = function(){
        
        var isEmpty = true;
        var i = 0;
        var qtd_rows = this.rowsCount();

        while(isEmpty && i < qtd_rows){
            isEmpty = isEmpty && this.rowAt(i).isEmpty();
            i++;
        }

        return isEmpty;    
    }

    this.isIndexValid = function(i,j) {

        var lastRowIndex = this.rowsCount()-1;

        if(i < 0 || i > lastRowIndex)
            return true;
        
        var lastColIndex = rowAt(i).length()-1;

        if(j < 0 || j > lastColIndex)
            return true;

        return false;
    }

    this.isPositionValid = function(i,j) {

        var lastRowPosition = this.rowsCount();

        if(i < 1 || i > lastRowPosition)
            return true;
        
        var lastColPosition = row(i).length();

        if(j < 1 || j > lastColPosition)
            return true;

        return false;
    }
}