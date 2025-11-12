import AnalyticsHeader from "../../../components/application-analytics/analytical-header-part-components/AnalyticsHeader"

const AnalyticsHeaderContainer = ({ onTabChange, activeTab }) => {
  return (
    <AnalyticsHeader onTabChange={onTabChange} activeTab={activeTab} />
  )
}

export default AnalyticsHeaderContainer
