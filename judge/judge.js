const shell = require("shelljs");
const async = require("async");
const fs = require("fs");
const path = require("path");
const { default: PQueue } = require("p-queue");
const queue = new PQueue({ concurrency: 1 });


//local machine path
let PATH_INIT = path.join(
  "/home/horizon/Desktop/Clients/Online-judge/judge/",
  "/submissions/"
);

//ec2 path
// let PATH_INIT = path.join(
//   "/home/ubuntu/judge/",
//   "/submissions/"
// );

//96 th  line const expectedOutput = curTestcase.output.trim();
// in deployment
// const execute = function (
//   language,
//   problem,
//   filename,
//   testfileName,
//   outputfileName,
//   timeMemoryfileName
// ) {
//   console.log("Contents of test file:");
//   printFileContents(filename);
//   const codefileName = "solution." + language;
//   // console.log(codefileName)
//   return `sudo docker run --rm -v ${filename}:/code/${codefileName} -v ${testfileName}:/code/testcase.txt -v ${outputfileName}:/code/output.txt -v ${timeMemoryfileName}:/code/timeMemory.txt thearchitect19/ask-senior ${language} output.txt timeMemory.txt ${problem.time}`;
// };


// in development
const execute = function (
  language,
  problem,
  filename,
  testfileName,
  outputfileName,
  timeMemoryfileName
) {
  console.log("Contents of test file:");
  printFileContents(filename);
  const codefileName = "solution." + language;
  // console.log(codefileName)
  return `docker run --rm -v ${filename}:/code/${codefileName} -v ${testfileName}:/code/testcase.txt -v ${outputfileName}:/code/output.txt -v ${timeMemoryfileName}:/code/timeMemory.txt online-judge ${language} output.txt timeMemory.txt ${problem.time}`;
};


const printFileContents = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    console.log(fileContents);
  } catch (err) {
    console.error("Error reading file:", err.message);
  }
};




const test = function (problem, submission, op, callback) {
  const PATH = path.join(PATH_INIT, submission._id.toString(), "/");
  
  const code = submission.code;
  // console.log(code)
  const filename = PATH + "solution." + submission.language;
  const testfileName = PATH + "testcase.txt";
  const outputfileName = PATH + "output.txt";
  const timeMemoryfileName = PATH + "timeMemory.txt";
  let allTestcases = [];
  
  if (op === "runcode") allTestcases = [...problem.sampleTestcases];
  else allTestcases = [...problem.sampleTestcases, ...problem.systemTestcases];
  // console.log(allTestcases)
  let result = [];

  async.waterfall([
    function (next) {
      fs.mkdir(PATH.slice(0, -1), (err) => {
        if (err) next(null, err);
        else next(null, null);
      });
    },
    function (err, next) {
      if (err) next(null, err);
      fs.closeSync(fs.openSync(outputfileName, "w"));
      fs.closeSync(fs.openSync(timeMemoryfileName, "w"));
      fs.closeSync(fs.openSync(filename, "w"));
      fs.closeSync(fs.openSync(testfileName, "w"));
      next(null, null);
    },
    function (err, next) {
      if (err) next(null, err);
      fs.writeFile(filename, code, (err) => {
        if (err) console.log(err);
        next(null, null);
      });
    },
    function (err, next) {
      if (err) next(null, err);
      async.forEachLimit(
        allTestcases,
        1,
        function (curTestcase, cb) {
          // console.log(curTestcase)
          async.waterfall([
            function (next) {
              if (err) next(null, err);
              fs.writeFile(testfileName, curTestcase.input, (err) => {
                
                if (err) console.log(err);
                next(null, null);
              });
            },
            function (err, next) {
              if (err) next(null, err);
              
              shell.cd(PATH_INIT);
              shell.exec(
                
                execute(
                  submission.language,
                  problem,
                  filename,
                  testfileName,
                  outputfileName,
                  timeMemoryfileName
                ),
                function () {
                  next(null, null);
                }
              );
            },
            function (err, next) {
              
              if (err) next(null, err);
              try {
                const expectedOutput = curTestcase.output.trim();

                const actualOutput = fs
                  .readFileSync(outputfileName)
                  .toString()
                  .trim();
                
                const timeMemoryOutput = fs
                  .readFileSync(timeMemoryfileName)
                  .toString()
                  .trim();

                let arr = timeMemoryOutput.split("\n");
                const time = arr.slice(-2)[0],
                  memory = arr.slice(-1)[0];

                let curResult = {
                  actualOutput: actualOutput,
                  time: parseFloat(time),
                  memory: parseFloat(memory),
                  CE: false,
                  RTE: false,
                  TLE: false,
                  MLE: false,
                  AC: false,
                  WA: false,
                };

                if (actualOutput.includes("COMPILATION ERROR")) {
                  curResult.CE = true;
                  curResult.time = 0;
                  curResult.memory = 0;
                } else if (actualOutput.includes("MLE")) curResult.MLE = true;
                else if (actualOutput.includes("TLE")) curResult.TLE = true;
                else if (actualOutput.includes("RUNTIME ERROR"))
                  curResult.RTE = true;
                else if (
                  op !== "customInput" &&
                  actualOutput === expectedOutput
                )
                  curResult.AC = true;
                else if (op !== "customInput") curResult.WA = true;

                result.push(curResult);
                cb();
              } catch (err) {
                callback(err, null);
              }
            },
          ]);
        },
        function (err) {
          if (err) {
            next(null, err);
          }
          next(null, null);
        }
      );
    },
    function (err) {
      if (err) callback(err, null);
      fs.rmdir(PATH.slice(0, -1), { recursive: true }, (err) => {
        if (err) callback(err, null);
        else callback(null, result);
      });
    },
  ]);
};

const addSubmission = (problem, submission, op, callback) => {
  queue
    .add(() => test(problem, submission, op, callback))
    .then(() => null)
    .catch((err) => callback(err, null));
};

module.exports = addSubmission;

