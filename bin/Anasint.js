function Anasint(){

    this.BNF = [];

    this.readBNF = function(codeFile){
        
        this.BNF = [];

        for( var i = 0; i < codeFile.rowsCount(); i++ ) {
            
            var codeRow = codeFile.rowAt(i);
            codeRow.text = codeRow.text.trim();

            if ( !codeRow.isEmpty() ){
                var rowTextSplit = codeRow.text.split( " = " );

                if( rowTextSplit.length != 2 ){
                    throw new Error("BNF READ: line with wrong sintax. More than one attribution or white space missing.")
                }

                var leftMember   = rowTextSplit[0].trim();
                var rightMembers = rowTextSplit[1].trim();

                var rightMembersArray = rightMembers.split( " " );
                rightMembersArray.remove("");

                if ( this.BNF[leftMember] == undefined )
                    this.BNF[leftMember] = [];

                this.BNF[leftMember].push( rightMembersArray );   
            }      
        }
    }

    this.run = function(){
        
    }



}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
