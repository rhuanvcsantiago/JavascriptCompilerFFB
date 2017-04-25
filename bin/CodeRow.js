function CodeRow(n, t){
    
    this.number = n || 0;
    this.text   = t || "";

    this.length = function() {
        return this.text.length;
    }

    this.col = function(i) {
        if(this.text[i-1] == undefined)
            throw new Error("[NUMERO DA COLUNA][ " + i + " ] solicitada não existe nesse objeto ROW.");
        else 
            return this.text[i-1];
    } 

    this.colAt = function(i) {
        if(this.text[i] == undefined)
            throw new Error("[INDEX DA COLUNA][ " + i + " ] solicitada não existe nesse objeto ROW.");
        else 
            return this.text[i];
    }  

    this.isEmpty = function(){
        if (this.length() == 0 || ( (this.length() == 1) && (this.colAt[0]=="\n") ) )
            return true;
        else
            return false; 
    }
}