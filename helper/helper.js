import axios from "axios";

export function attempts_Number(result){
  return result.filter(r => r !== '').length
}

export function earnPoints_Number(result, answers, points){
  return result.map((element, i) => answers[i] === element).filter(i => i).map(i => points).reduce((prev, curr) => prev + curr, 0);
}

export function wrong_Answers(result, answers, points){
  return result.map((element, i) => (answers[i] !== element) && (element !== '')).filter(i => i).map(i => points).reduce((prev, curr) => prev + curr, 0);
}

export function flagResult(totalPoints, earnPoints){
  return (totalPoints * 50 / 100) < earnPoints
}

/** get result data */
export async function getResult(url, callback){
  const results = await (await axios.get(url))?.results;
  return callback ? callback(results) : results;
}

/** post result data */
export async function postResult(url,result, callback){  
  const data = await (await axios.post(url, result))?.data;
  return callback ? callback(data) : data;
}