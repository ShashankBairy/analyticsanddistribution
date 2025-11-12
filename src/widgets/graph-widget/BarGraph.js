import React from "react";
import styles from "./BarGraph.module.css";
import reddot2 from "../../assets/application-analytics/red2.svg";
import greendot2 from "../../assets/application-analytics/green2.svg";

// const graphData = [
//   { year: "2018-2019", issued: 50, sold: 100 },
//   { year: "2019-2020", issued: 40, sold: 70 },
//   { year: "2021-2022", issued: 65, sold: 30 },
//   { year: "2023-2024", issued: 80, sold: 60 },
// ];

// const percentage = 100;
// const BarGraph = ({graphBarData}) => {
//   return (
//     <div>
//       <div className={styles.all_graphs}>
//         {graphBarData.map((graph,index) => {
//           return (
//             <div key={index} className={styles.bars_and_year}>
//               <div className={styles.bars}>
//                 <div className={styles.red_bar_wrapper}>

//                   <div
//                     className={styles.red_bar}
//                     style={{ height: `${graph.issued}%` }}
//                     >
//                       <img src={reddot2} className={styles.reddot}/>
//                     </div>
//                 </div>
//                 <div className={styles.green_bar_wrapper}>

//                   <div
//                     className={styles.green_bar}
//                     style={{ height: `${graph.sold}%` }}
//                   >
//                     <img src={greendot2} className={styles.greendot}/>
//                   </div>
//                 </div>
//               </div>
//               <p className={styles.year}>{graph.year}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BarGraph;

const BarGraph = ({ graphBarData }) => {
  return (
    <div>
      <div className={styles.all_graphs}>
        {graphBarData.map((graph, index) => {
        
          const issued = Math.floor(Number(graph.issued) || 0);
          const sold = Math.floor(Number(graph.sold) || 0);

          console.log("Rounded Values →", graph.year, issued, sold);

          return (
            <div key={index} className={styles.bars_and_year}>
              <div className={styles.bars}>
                <div className={styles.red_bar_wrapper}>
                  <div
                    className={styles.red_bar}
                    style={{ height: `${issued}%` }}
                  >
                    <img src={reddot2} className={styles.reddot} alt="issued-dot" />
                  </div>
                </div>

                <div className={styles.green_bar_wrapper}>
                  <div
                    className={styles.green_bar}
                    style={{ height: `${sold}%` }}
                  >
                    <img src={greendot2} className={styles.greendot} alt="sold-dot" />
                  </div>
                </div>
              </div>
              <p className={styles.year}>{graph.year}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarGraph;