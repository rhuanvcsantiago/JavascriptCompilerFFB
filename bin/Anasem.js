function Anasem() {    

    this.contextAnaliser = function(anaSemStack){
        var contextPool = {};
        var context = { 
                            name: 'main', 
                            variables: {}, 
                            pos: {inicio: 0, fim:0}
                      };
        var handler;
        var lastContextName = "main";

        contextPool[context.name] = context;
        
        for (var index = 0; index < anaSemStack.length; index++) {
            var element = anaSemStack[index];

            if(element == '<FUNCTION_DECLARATION>') {
                
                contextPool[lastContextName].pos.fim = index-1;
                
                handler = this.function_declaration_handler(anaSemStack,index);
                
                context = handler.context; 
                context.pos.inicio = index;               
                contextPool[context.name] = context;

                lastContextName = context.name;

                index = handler.index;

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
                 context.pos.inicio = index;

                 contextPool[lastContextName].pos.fim = index-1;
                 lastContextName = context.name;                
            }

        }

        contextPool[lastContextName].pos.fim = anaSemStack.length-1;
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
        context.pos = {inicio: 0, fim:0};
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

    this.execute = function(anaSemStack){
        
        var context = this.contextPool["main"];
        
        for (var i = context.pos.inicio; i < context.pos.fim; i++) {
            var element = anaSemStack[i];

            if( element == '<VARIABLE_ATTRIBUTION>' ) {
                solve_attributions(context, anaSemStack, i );
            }
            else if(element == '<EXPRESSION>') {

            }
        }

        function solve_attributions(context, anaSemStack, i){
            
            i++; // skipping <VARIABLE_ATTRIBUTION>

            var variableName = anaSemStack[i][1].token; // getting <IDENTIFIER> name 
            if( context.variables[variableName] == undefined )
                throw ("Variável [" + variableName + "] não declada anteriormente.");

            var attributtionStack = [];    
            var elementClass = "";

            i++; // skipping <IDENTIFIER> 
            i++; // skipping <ATTRIBUITING_OPERATOR>

            var expression = "";

            do {

                if( elementClass == "<FUNCTION_CALL>" ){
                    var solver = solve_functionCall( context, anaSemStack, i );
                    expression += solver.value;
                    i = solver.index;

                } else if (elementClass == "<IDENTIFIER>") {
                    expression += solve_identifier( context, anaSemStack, i );
                } else {
                    if( (elementClass != "<END_LINE>") && (typeof(anaSemStack[i]) == "object") && (elementClass != "") )
                        expression += anaSemStack[i][1].token;
                }   

            /* get next element */
                i++; 
                if( typeof(anaSemStack[i]) == "string" )
                    elementClass = anaSemStack[i];//[1].classe;
                else
                    elementClass = anaSemStack[i][1].classe;
            /* get next element */        
         
            } while (elementClass != "<END_LINE>");
            // ENQUANTO NAO CHEGAR NO FIM;

            context.variables[variableName] = eval(expression);

            console.log( "["+context.name + "." + variableName+"] = " + context.variables[variableName] );

        }

        function solve_identifier( context, anaSemStack, i  ){
            var variableName = anaSemStack[i][1].token;
            if( context.variables[variableName] == undefined )
                throw ("Variável [" + variableName + "] não declada anteriormente.");
            else {
                if( typeof(context.variables[variableName]) == "object" ){
                    if( context.variables[variableName].value == undefined  )    
                        throw ("Variável [" + variableName + "] não declada anteriormente.");
                    else
                        return context.variables[variableName].value;     
                } else {
                   return context.variables[variableName];
                }
            }
   
        }

        function solve_expression(){

            if(element == '<BASIC_ELEMENTS>') {}
            else if(element == '<OPERATOR>') {}
        }

        function solve_functionCallComplex(contextPool, anaSemStack, i ){
            
            i++; // skipping <FUNCTION_CALL>
            i++; // skipping <FUNCTION_OPEN>

            var functionName = anaSemStack[i][1].token;
            context = contextPool[functionName];

            var elementClass = "";
            while (elementClass != "<PRIMARY_SEPARATOR_CLOSE>"){
                /* get next element */
                i++; 
                if( typeof(anaSemStack[i]) == "string" )
                    elementClass = anaSemStack[i];//[1].classe;
                else
                    elementClass = anaSemStack[i][1].classe;
                /* get next element */ 
            }

            return {index:i, value:0};
        }
    }
}

//VARIABLE_ATTRIBUTION
//EXPRESSION