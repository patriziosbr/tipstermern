 export const formattedDate_ddmmyyyy = (dateStr)=>{
    console.log(dateStr, "dateStr");
    let formattedDate = "";
    if(dateStr.includes("/")) {
        const [day, month , year] = dateStr.split(" ")[0].split("/");
        const time = dateStr.split(" ")[1];
        if(year) {
          formattedDate = `${year}-${month}-${day}T${time}:00`
        } else {
          const currentYear = new Date().getFullYear();
          formattedDate = `${currentYear}-${month}-${day}T${time}:00`
        }
    }
    
    return formattedDate
  }

  export const formattedDate_iso = (dateStr) => {
    console.log(dateStr, "dateStr ISO");
  }
