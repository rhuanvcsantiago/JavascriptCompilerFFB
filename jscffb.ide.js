var compiler = new Compiler();

function insertRowBelow(currentCodeRowObject, rowText) {

    newRowText = rowText || ""; 

    newRowHTMLText = createRowText(newRowText);

    currentCodeRowObject.after( newRowHTMLText );

    currentCodeRowObject.next().children(".codeText").focus();

    updateRowNumbers( currentCodeRowObject.parent() );
   
}

function removeRow(currentCodeRowObject, rowStringToMove){

    var prevCodeRowObject     = currentCodeRowObject.prev();
    var prevCodeRowTextObject = prevCodeRowObject.children(".codeText");
    var prevCodeRowText       = prevCodeRowTextObject.text();
    
    prevCodeRowTextObject.text(prevCodeRowText + rowStringToMove);

    currentCodeRowObject.remove();

    updateRowNumbers( prevCodeRowObject.parent() );

    prevCodeRowTextObject.focus();
    placeCaretAt( prevCodeRowTextObject.get(0), prevCodeRowText.length );
    
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function createRowText( rowText ) {
    var string = "";
    string += '<div class="codeRow">';
    string +=       '<div class="col-xs-1  codeNumber"> 1 </div>';
    string +=       '<div class="col-xs-11 codeText" contenteditable="true">' + escapeHtml(rowText) + '</div>';  
    string +=  '</div>';
    return string;
}

function updateRowNumbers( codeFile ) {

    codeFile.find(".codeNumber").each( function( index ) {
        $( this ).text(index+1) ;
    });
   
}

function codeToString(){   
    var string = "";
    $("#CODE .codeText").each(function(){
        string += $( this ).text() + "\n";
    })
    return string;   
}

function toCodeObject(){
    var code = new CodeFile;

    $("#CODE .codeText").each(function( index ){

        var number  = index+1;
        var text    = $(this).text();

        code.pushRow(number, text + '\n');
    })

    return code; 
}

function countRows() {
    return CODE_AREA.children().length;
}

function placeCaretAt(node, position) {    
    node.focus();
    var textNode = node.firstChild;
    var caret = position; 
    var range = document.createRange();
    range.setStart(textNode, caret);
    range.setEnd(textNode, caret);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function placeCaretAt2(elem, position) {    
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

$("#IDE").on("keydown", ".codeText", function (e) {

    //objects
    var codeFile            = $(codeRowObject).parent()
    var codeRowObject       = $(this).parent();
    var codeRowTextObject   = $(this);
    var codeRowNumberObject = $(this).prev(); 
   
    // usefull values
    var rowNumber = Number(codeRowNumberObject.text());
    var rowTextLength = codeRowTextObject.text().length;
    var caretPosition = window.getSelection().getRangeAt(0).startOffset;

    var selectionStartPosition = window.getSelection().getRangeAt(0).startOffset;
    var selectionEndPosition   = window.getSelection().getRangeAt(0).endOffset;

    // temp values
    var rowStringToStay;
    var rowStringToMove = "";

    //TAB -> adicionar 3 espaços
    //if (e.keyCode ===  9) {} 

    //BACKSPACE 
    if ( e.keyCode === 8 ) {
        // se tiver no inicio da linha
        if ( caretPosition === 0 ){
            // nao remove a primeira linha
            if( rowNumber === 1 )
                return false;
            // se tiver algum conteúdo na linha
            if( rowTextLength > 0 ){
               //pega conteudo da linha 
               rowStringToMove = codeRowTextObject.text();        
            }
            
            removeRow(codeRowObject, rowStringToMove);
            return false;
        }
    }
    //ENTER
    if (e.keyCode === 13) {
        //se o enter nao foi no final da linha, ou seja, tinha conteudo depois do local do enter
        if (caretPosition < rowTextLength) {
            // pegar conteúdo
            rowStringToStay = codeRowTextObject.text().substring(0, caretPosition);
            rowStringToMove = codeRowTextObject.text().substring(caretPosition, rowTextLength)

            // excluir conteúdo restante da linha
            codeRowTextObject.text(rowStringToStay);
        }
        // criar nova linha
        insertRowBelow(codeRowObject, rowStringToMove);
        // changeFocusToNewRow();
        return false;       
    }

    //  UP ARROW
    if (e.keyCode === 38) { 
        if( rowNumber === 1 )
            return false;

        var prevCodeRowObject     = codeRowObject.prev();
        var prevCodeRowTextObject = prevCodeRowObject.children(".codeText");
        var prevCodeRowTextLength = prevCodeRowTextObject.text().length;
        var positionToGo = 0;

        if( caretPosition >= prevCodeRowTextLength){
            positionToGo = prevCodeRowTextLength;
        } else if( caretPosition < prevCodeRowTextLength ) {
            positionToGo = caretPosition;
        } 
        
        placeCaretAt( prevCodeRowTextObject.get(0), positionToGo );
    }
    //  DOWN ARROW
    if (e.keyCode === 40) {
         codeRowObject.next().children(".codeText").focus();
         placeCaretAt( codeRowObject.next().children(".codeText").get(0), caretPosition );

    }
     
});

$("#IDE").on("focus", ".codeText", function (e) {    
    //$(this).text( $(this).text() );              
});

$("#IDE").on("keyup", ".codeText", function (e) {    
    compiler.codeFile = toCodeObject();
    compiler.runOnKeyUp();             
});

$("#IDE").on("focusout", ".codeText", function (e) {    
    // formating text
    // console.log($(this).text());              
});

$("#runButton").click( function(){ 
    //compiler.codeFile = toCodeObject();
    //compiler.runOnButtonPlay(); 
});

var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();

    reader.onload = function(){
        
        $("#BNF").empty();
        
        var text = reader.result;
        var row = "";

        for (var i = 0; i < text.length; i++) {
            var char = text[i];            

            if( char == "\n" ){
                $("#BNF").append( createRowText(row) );
                updateRowNumbers( $("#BNF") );
                row = "";
            }

            row += char;
        }
    }

    reader.readAsText(input.files[0]);
};

//loadBNF();










