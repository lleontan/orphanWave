const slurList = [
  '\b(?<!van.)dykes?\b',
  '\bfagg?(s?\b|ot|y|ier)',
  '\bgooks?\b',
  'honk(ey|ie)',
  '\bkikes?\b',
  'nigg(a|er)s?',
  'shemale',
  '\bspick?s?\b',
  'beaner',
  'trann(ie|y)',
  'cunt'
]
const containsSlur=(target)=>{
  slurList.forEach((regexStr)=>{
    let matcher=new RegExp(regexStr);
    if(matcher.test(target)){
      return true;
    }
  });
  return false;
}

module.exports= containsSlur;
