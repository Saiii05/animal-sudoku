export function exportPuzzle(payload:any){
  const json = JSON.stringify(payload);
  // base64-safe
  return btoa(encodeURIComponent(json));
}
export function importPuzzle(token:string){
  try{
    const json = decodeURIComponent(atob(token));
    return JSON.parse(json);
  }catch(e){
    return null;
  }
}

