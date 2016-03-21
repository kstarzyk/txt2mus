# txt2mus [under development]

### About
**txt2mus** is a little node.js package which combined with powerful **sox**, awesome **ES6**, old (but good) **bash** creates .wav files from .json__
### Dependencies
Use **txt2mus** you will need UNIX-likely OS and **sox**:
- Linux &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   ```$ apt-get install sox
   ```
- MacOS &nbsp;&nbsp;&nbsp;&nbsp;
```$ brew install sox
```


**txt2mus** does not use any external npm package so there is no need for npm install.  

### Available samples
- Guitar  
- Clarinette

### Usage
```bash
$ scrtips/concat.sh <name_of_dir_in_examples>
```
The result (as one .wav file) will be created in examples/<name_of_dir_in_examples> and you can use any

### Features
- Interpolates note from existing samples if note in .snc doesn't exist

### Documentation
(writing documentation is pointless at *now*)
