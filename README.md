# Tilerator analyzer

Tilerator analyzer is a Nodejs tool that collect data from the tilerator API to manipulate it for metrics analysis.

It was built to manually monitor full planet tile generation, which is a long and delicate process.

## Usage

For a better use of this tool make sure that:
- The tilerator Queue is empty before generating full planet tile generation. 
- Use the flag `-j.keepJob=true` when generating tiles

Log into the instance you want to analyze, for example:
```
$ ssh -L 6535:localhost:6535 maps1004.eqiad.wmnet
```

Start the tool with `npm start`.

**The tool will generate logs for each kind of state tilerator have for its jobs and one main log with overall status.**

## TODO
[ ] Improve metric collection
[ ] Move storage from log files to a proper DB