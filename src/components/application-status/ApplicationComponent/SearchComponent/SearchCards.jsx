import React from "react";
import styles from "./SearchCards.module.css";
import DivisionDesign from "../../../../assets/application-status/DivisionDesign.svg";
import Statusbar from "../../../../widgets/StatusBar/Statusbar";

import {usePermission}  from "../../../../hooks/usePermission ";
 
const SearchCards = ({ data, maxResults = 5, onCardClick }) => {
  const {isFullAccess} = usePermission("STATUS_SALE");
  const canClickCard = isFullAccess;

  const displayData = (data || []).filter(
    (item) => item.displayStatus
  );
  const filteredData = displayData.slice(0, maxResults);
  // Include all statuses including "Damaged" and limit to maxResults
  console.log("SearchCards Data:", filteredData); // Debugging
  return (
    <div className={styles.Search_Cards_recent_search}>
      <h3 className={styles.Search_Cards_recent_search__title}>Search Result</h3>
      <div className={styles.Search_Cards_recent_search__cards}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const isConfirmed = item.displayStatus === "Confirmed";
            const isDisabledByStatus = isConfirmed;
            const isDisabledByPermission = !canClickCard;
            const isDisabled = isDisabledByStatus || isDisabledByPermission;
            return (
              <div
                key={item.id || item.applicationNo} // Use applicationNo as fallback
                className={`${styles.Search_Cards_recent_search__card} ${isDisabled ? styles.disabled : ''}`}
                onClick={() => !isDisabled && onCardClick && onCardClick(item)}
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.6 : 1
                }}
              >
              <figure className={styles.Search_Cards_recent_search__image}></figure>
              <p className={styles.Search_Cards_recent_search__id}>
                {item.applicationNo}
              </p>
              <p className={styles.Search_Cards_recent_search__Campus}>
                {item.campus}
              </p>
              <p className={styles.Search_Cards_recent_search__Zone}>
                {item.zone}
              </p>
              <figure className={styles.Search_Cards_recent_search__division}>
                <img src={DivisionDesign} alt="Division Design Icon" />
              </figure>
              <div className={styles.Search_Cards_recent_search__status}>
                <Statusbar
                  isSold={item.displayStatus === "Sold" || item.displayStatus === "Confirmed"}
                  isConfirmed={item.displayStatus === "Confirmed"}
                  isDamaged={item.displayStatus === "Damaged"}
                  singleStar={item.displayStatus === "Damaged"}
                />
              </div>
            </div>
            );
          })
        ) : (
          <p className={styles.Search_Cards_recent_search__no_results}>
            No results found
          </p>
        )}
      </div>
    </div>
  );
};
 
export default SearchCards;
 