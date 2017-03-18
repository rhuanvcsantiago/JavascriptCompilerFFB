function Compiler(){

    this.codeFile = new CodeFile(); //nova modelagem -> pode ser um array de arquivos -> abre possibilidade
    this.analex   = new Analex();
    this.anasint  = new Anasint();
    
    // Function witch runs evetime a Key is pressed.
    this.runOnKeyUp = function(){

        console.log( this.codeFile.toString() );

        this.analex.tokenizer(this.codeFile);

    }
}