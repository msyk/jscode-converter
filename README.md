# jscode-converter
Convert the js code containing synchronous communication to asynchronous.
I'm just woriking to realize the above feature.
This is going to a part of INTER-Mediator.

Masayuki Nii

## Installing
After install this repository on your side, you have to install node and npm first.
And you have to execute commands below.
<pre>
cd jscode-converter
npm install acorn
npm install escodegen
</pre>

## Programs
### iterate-all.js
This is my first trial for the JavaScript parser "acorn." This can iterate all node of parsed JS code.

You can run this program:
<pre>
node iterate-all.js
</pre>

### iterate-all-generic.js
Improved version of first one.
