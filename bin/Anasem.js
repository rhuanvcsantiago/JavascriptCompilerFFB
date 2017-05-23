function Anasem() {    

    this.execute = function(anaSemStack){
        var contextPool = {};
        var context = {name: 'main', variables: {}},handler;
        contextPool[context.name] = context;
        for (var index = 0; index < anaSemStack.length; index++) {
            var element = anaSemStack[index];

            if(element == '<FUNCTION_DECLARATION>') {
                handler = this.function_declaration_handler(anaSemStack,index);
                index = handler.index;
                context = handler.context;                
                contextPool[context.name] = context;
            } else if (element == '<TYPE_IDENTIFIER_SEQUENCE>') {
                handler = this.variable_declaration_handler(anaSemStack,index,context);
                index = handler.index;
                context = handler.context;
            } else if (element == '<FUNCTION_CALL>') {
                handler = this.function_call_handler(anaSemStack,index,contextPool);
                index = handler.index;
            } else if (element == '<VARIABLE_DECLARATION>') {
                handler = this.multiple_variable_declaration_handler(anaSemStack,index,context);
                context = handler.context;
                index = handler.index;
            } else if ( typeof (element) != "string" && element[0] == "<IDENTIFIER>" ){
                 handler = this.rest_handler(anaSemStack,index,context);
                 //context = handler.context;  
                 //index = handler.index;
            } else if (element == '<START_PROGRAM>') {
                 context = contextPool['main'];                 
            }
        }
        this.contextPool = contextPool;
    }

     this.rest_handler = function (anaSemStack,index,context) {
        var variable = anaSemStack[index][1].token;
        if (context.variables[variable] == undefined) {
            //console.log(anaSemStack[index][1]);
            var ident = anaSemStack[index][1]; 
            throw ('IDENTIFICADOR NAO DECLARADO: [ ' + ident.token + ' ] POSIÇÃO: [' + ident.position.row + ", "+ ident.position.col + ']');            
        }        
    }

    this.function_declaration_handler = function (anaSemStack,index) {
        var context = {};
        context.return = anaSemStack[index+2][1].token;
        context.name = anaSemStack[index+4][1].token;
        context.token = anaSemStack[index+4][1];
        context.variables = {};
        return {index: index+4, context: context};
    }

    this.variable_declaration_handler = function (anaSemStack,index,context) {
        var variable = {    
                            name: anaSemStack[index+2][1].token,
                            type: anaSemStack[index+1][1].token,
                            token: anaSemStack[index+2][1]
                        }
        
        if(context.variables[variable.name] == undefined) {
            context.variables[variable.name] = variable;
        } else {
            var ident = variable.token;
            throw ('Variavel ja declarada: [ ' + ident.token + ' ] POSIÇÃO: [' + ident.position.row + ", "+ ident.position.col + ']');
        }
                    
        return {index: index+2, context: context};
    }

    this.function_call_handler = function(anaSemStack,index,contextPool){
        var function_name = anaSemStack[index+3][1].token;
        if(contextPool[function_name] == undefined) {
            var ident = anaSemStack[index+3][1];
            throw ('Função não declarada: [ ' + ident.token + ' ] POSIÇÃO: [' + ident.position.row + ", "+ ident.position.col + ']');  
        }
        // verificar parametros que esta recebendo e realizaer tratamento
        return {index: index+3};
    }

    this.multiple_variable_declaration_handler = function(anaSemStack,index,context){
        
        var var_type =  anaSemStack[index+1][1].token;
        var variable = {};
        
        for (index; index < anaSemStack.length; index++) {
            var element = anaSemStack[index];

            if (typeof (element) != "string" && element[0] == "<IDENTIFIER>") {

                variable = {
                    name: anaSemStack[index][1].token,
                    type: var_type,
                    token: anaSemStack[index][1]
                };

                if (context.variables[variable.name] == undefined) {
                    context.variables[variable.name] = variable;
                } else {
                    var ident = variable.token;
                    throw ('Variavel ja declarada: [ ' + ident.token + ' ] POSIÇÃO: [' + ident.position.row + ", "+ ident.position.col + ']');
                }
            }

            if (typeof (element) != "string" && element[0] == "<END_LINE>")
                return { index: index, context: context}
        }      
    }
}

//VARIABLE_ATTRIBUTION
//EXPRESSION