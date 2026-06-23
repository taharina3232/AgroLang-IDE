let variables = {};

function runCode() {
  const code = document.getElementById("code").value;
  const output = document.getElementById("output");
  
  output.innerHTML = "";
  variables = {}; 

  const lines = code.split("\n");

  lines.forEach((line, index) => {
    line = line.trim();
    let lineNumber = index + 1;

    if (line === "" || line.startsWith("#")) {
      return;
    }

    if (line.startsWith("set ")) {
      let assignment = line.replace("set ", "").trim();
      if (assignment.includes("=")) {
        let parts = assignment.split("=");
        let varName = parts[0].trim();
        let varValueExpr = parts[1].trim();

        try {
          let evalValue = evaluateExpression(varValueExpr);
          variables[varName] = evalValue;
        } catch (err) {
          output.innerHTML += <span class="out-error">🔴 Line ${lineNumber}: Invalid variable assignment.</span><br>;
        }
      } else {
        output.innerHTML += <span class="out-error">🔴 Line ${lineNumber}: Syntax Error in 'set'. Missing '='.</span><br>;
      }
    }

    else if (line.startsWith("print ")) {
      let content = line.replace("print ", "").trim();
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1);
        output.innerHTML += <span class="out-print">🟢 [Output]: ${content}</span><br>;
      } 
      else if (variables.hasOwnProperty(content)) {
        output.innerHTML += <span class="out-print">🟢 [Output]: ${variables[content]}</span><br>;
      } 
      else {
        output.innerHTML += <span class="out-error">🔴 Line ${lineNumber}: Undefined variable or missing quotes in print.</span><br>;
      }
    }

    else if (line.startsWith("calc ")) {
      let expr = line.replace("calc ", "").trim();
      try {
        let result = evaluateExpression(expr);
        output.innerHTML += <span class="out-calc">🟡 [Result]: ${result}</span><br>;
      } catch (err) {
        output.innerHTML += <span class="out-error">🔴 Line ${lineNumber}: Error evaluating calculation expression.</span><br>;
      }
    }

    else {
      output.innerHTML += <span class="out-error">❌ Line ${lineNumber}: Unknown command "${line}"</span><br>;
    }
  });
}

function evaluateExpression(expr) {
  let processedExpr = expr;
  for (let key in variables) {
    let regex = new RegExp(\\b${key}\\b, 'g');
    processedExpr = processedExpr.replace(regex, variables[key]);
  }
  return Function("use strict"; return (${processedExpr}))();
}

function clearConsole() {
  document.getElementById("output").innerHTML = "";
}
