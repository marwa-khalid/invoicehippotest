// src/utils/dateUtils.ts

// Function to get the date range for a given period and year
export const getDateRange = (period: any, year: any): string => {
    const periodValue = typeof period === "number" ? period : period?.Value;
  
    if (periodValue >= 1 && periodValue <= 12) {
      const startDate = new Date(year, periodValue - 1, 1);
      const endDate = new Date(year, periodValue, 0); // Last day of the month
  
      const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${day}-${month}-${date.getFullYear()}`;
      };
  
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  
    switch (periodValue) {
      case 101: return `01-01-${year} - 31-03-${year}`;
      case 102: return `01-04-${year} - 30-06-${year}`;
      case 103: return `01-07-${year} - 30-09-${year}`;
      case 104: return `01-10-${year} - 31-12-${year}`;
      case 201: return `01-01-${year} - 30-06-${year}`;
      case 202: return `01-07-${year} - 31-12-${year}`;
      case 13:  return `01-01-${year} - 31-12-${year}`;
      default:   return "";
    }
  };
  
  // Function to parse a date string into a Date object
  export const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };
  