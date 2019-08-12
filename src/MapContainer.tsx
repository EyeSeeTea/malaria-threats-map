import React, { Component } from "react";
import Map from "./components/Map";
import { connect, Provider } from "react-redux";
import styled from "styled-components";
import { fetchPreventionStudiesRequest } from "./malaria/prevention/actions";
import { fetchDiagnosisStudiesRequest } from "./malaria/diagnosis/actions";
import { fetchTreatmentStudiesRequest } from "./malaria/treatment/actions";
import { fetchInvasiveStudiesRequest } from "./malaria/invasive/actions";

const PageWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

type Props = {
  fetchPreventionStudies: typeof fetchPreventionStudiesRequest;
  fetchDiagnosisStudies: typeof fetchDiagnosisStudiesRequest;
  fetchTreatmentStudies: typeof fetchTreatmentStudiesRequest;
  fetchInvasiveStudies: typeof fetchInvasiveStudiesRequest;
};

class MapContainer extends Component<Props> {
  componentDidMount() {
    this.props.fetchPreventionStudies();
    this.props.fetchDiagnosisStudies();
    this.props.fetchTreatmentStudies();
    this.props.fetchInvasiveStudies();
  }

  render() {
    return (
      <PageWrapper>
        <Map />
      </PageWrapper>
    );
  }
}

const mapDispatchToProps = {
  fetchPreventionStudies: fetchPreventionStudiesRequest,
  fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
  fetchTreatmentStudies: fetchTreatmentStudiesRequest,
  fetchInvasiveStudies: fetchInvasiveStudiesRequest
};

export default connect(
  null,
  mapDispatchToProps
)(MapContainer);
