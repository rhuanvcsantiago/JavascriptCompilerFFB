
/*

   
    # TODO
       - IMPLEMENTAR FUNCAO DELETE
       - ORGANIZAR IDE EM UMA CLASSE
 

*/


var compiler = new Compiler();
var CODE_AREA = $("#codeArea");
var RUN_BUTTON = $("#runButton");

function insertRowBelow(currentRowNumber, currentRowText) {

    newRowNumber = currentRowNumber + 1; // a linha abaixo sempre é a linha atual + 1;
    newRowText = currentRowText || ""; // seta um valor default, caso currentRowText seja undefined;

    // cria o texto html
    newRowHTMLText = createRowText(newRowNumber, newRowText);

    // insere html da newRow no INDICE(retirar 1 da rowNumber) abaixo da linha atual(rowNumber)
    CODE_AREA.children().eq(currentRowNumber - 1).after(newRowHTMLText);

    //muda o foco para a linha inserida
    CODE_AREA.children().eq(currentRowNumber).children().eq(1).focus();

    // verifica se a linha inserida não era a última
    if (newRowNumber < countRows()) {
        // atualiza o número das proximas linhas.
        updateRowNumbersBelow(newRowNumber);
    }


}

function removeCurrentRow(currentRowNumber, currentRowText){

    var currentRowIndex = currentRowNumber-1;
    var rowAbove = CODE_AREA.children().eq(currentRowIndex-1).children();   
    var rowAboveTextLength = rowAbove.eq(1).text().length;

    CODE_AREA.children().eq(currentRowIndex).remove();
           
    if (currentRowText != "" ){
        CODE_AREA.children().eq(currentRowIndex-1).children().eq(1).append(currentRowText);
    }

    // atualiza o número das proximas linhas.
    updateRowNumbersBelow(currentRowIndex);

     //muda o foco para a linha de cima
    CODE_AREA.children().eq(currentRowIndex-1).children().eq(1).focus();
    placeCaretAt( CODE_AREA.children().eq(currentRowIndex-1).children().get(1), rowAboveTextLength );
    
}

function createRowText(lineNumber, lineContent) {
    return '<div class="row line"><div class="col-xs-1 number">' + lineNumber + '</div><div class="col-xs-11 text" contenteditable="true">' + lineContent + '</div></div>';
}

function updateRowNumbersBelow(currentRow) {
    var rowsCount = countRows();

    for (var i = currentRow; i < rowsCount; i++) {
        currentRow++;
        CODE_AREA.children().eq(i).children().eq(0).text(currentRow);
    }
}

function getAllCode(){   
    var string = "";
    $(".text").each(function(){
        string += $( this ).text() + "\n";
    })
    return string;   
}

function toCodeObject(){
    var code = new CodeFile;

    $(".row.line").each(function(){

        var number  = $( $( this ).children()[0] ).text();
        var text    = $( $( this ).children()[1] ).text();

        code.pushRow(number, text);
    })

    return code; 
}

function countRows() {
    return CODE_AREA.children().length;
}

function placeCaretAt(node, position) {    
    node.focus();
    var textNode = node.firstChild;
    var caret = position; // insert caret after the 10th character say
    var range = document.createRange();
    range.setStart(textNode, caret);
    range.setEnd(textNode, caret);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}


CODE_AREA.on("keydown", "div.col-xs-11.text", function (e) {

    //objects
    var rowObject = $(this).parent();
    var rowTextObject = $(this);
    var rowNumberObject = $(rowObject.children()[0]);

    // usefull values
    var rowNumber = Number(rowNumberObject.text());
    var rowTextLength = rowTextObject.text().length;
    var rowPositionClick = window.getSelection().getRangeAt(0).startOffset;

    // temp values
    var rowStringToStay;
    var rowStringToMove = "";

    //TAB -> adicionar 3 espaços
    //if (e.keyCode ===  9) {} 

    //BACKSPACE 
    if (e.keyCode === 8) {
        // se tiver no inicio da linha
        if (rowPositionClick === 0){
            // nao remove a primeira linha
            if(rowNumber=== 1)
                return false;
            // se tiver algum conteúdo na linha
            if(rowTextLength>0){
               //pega conteudo da linha 
               rowStringToMove = rowTextObject.text();        
            }
            
            removeCurrentRow(rowNumber, rowStringToMove);
            return false;
        }

    }
    
    //ENTER
    if (e.keyCode === 13) {
        //se o enter nao foi no final da linha, ou seja, tinha conteudo depois do local do enter
        if (rowPositionClick < rowTextLength) {
            // pegar conteúdo
            rowStringToStay = rowTextObject.text().substring(0, rowPositionClick);
            rowStringToMove = rowTextObject.text().substring(rowPositionClick, rowTextLength)

            // excluir conteúdo restante da linha
            rowTextObject.text(rowStringToStay);
        }
        // criar nova linha
        insertRowBelow(rowNumber, rowStringToMove);
        // changeFocusToNewRow();
        return false;       
    } 
});

CODE_AREA.on("focus", "div.col-xs-11.text", function (e) {    
    $(this).text( $(this).text() );              
});

CODE_AREA.on("keyup", "div.col-xs-11.text", function (e) {    
    compiler.codeFile = toCodeObject();
    compiler.runOnKeyUp();             
});

CODE_AREA.on("focusout", "div.col-xs-11.text", function (e) {    
    // formating text
    // console.log($(this).text());              
});

RUN_BUTTON.click( function(){ 
    compiler.codeFile = toCodeObject();
    compiler.runOnButtonPlay(); 
});

