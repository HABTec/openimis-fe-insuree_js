import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from "react-intl";
import { formatMessage, withModulesManager, SelectInput } from "@openimis/fe-core";
import { fetchIdentificationTypes } from "../actions";
import _debounce from "lodash/debounce";
import _ from "lodash";

class IdentificationTypePicker extends Component {
  componentDidMount() {
    if (!this.props.identificationTypes) {
      // prevent loading multiple times the cache when component is
      // several times on a page
      setTimeout(() => {
        !this.props.fetching && !this.props.fetched && this.props.fetchIdentificationTypes(this.props.modulesManager);
      }, Math.floor(Math.random() * 300));
    }
  }

  nullDisplay = this.props.nullLabel || formatMessage(this.props.intl, "insuree", `IdentificationType.null`);

  formatSuggestion = (i) =>
    !!i ? `${formatMessage(this.props.intl, "insuree", `IdentificationType.${i}`)}` : this.nullDisplay;

  onSuggestionSelected = (v) => this.props.onChange(v, this.formatSuggestion(v));

  isUnder18 = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age < 18;
  }
  render() {
    const {
      intl,
      identificationTypes,
      withLabel = true,
      label = "IdentificationTypePicker.label",
      withPlaceholder = false,
      placeholder,
      value,
      reset,
      readOnly = false,
      required = false,
      withNull = false,
      nullLabel = null,
    } = this.props;
    let options = !!identificationTypes
      ? identificationTypes.map((v) => ({ value: v, label: this.formatSuggestion(v) }))
      : [];
    if (withNull) {
      options.unshift({ value: null, label: this.formatSuggestion(null) });
    }
    if (this.props.dob && this.isUnder18(this.props.dob)) {
      options = options.filter((option) => option.value !== "D");
      options = options.filter((option) => option.value !== "V");
    }
    return (
      <SelectInput
        module="insuree"
        options={options}
        label={!!withLabel ? label : null}
        placehoder={
          !!withPlaceholder
            ? placeholder || formatMessage(intl, "insuree", "IdentificationTypePicker.placehoder")
            : null
        }
        onChange={this.onSuggestionSelected}
        value={value}
        reset={reset}
        readOnly={readOnly}
        required={required}
        selectThreshold={this.selectThreshold}
        withNull={withNull}
        nullLabel={this.nullDisplay}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  identificationTypes: state.insuree.identificationTypes,
  fetching: state.insuree.fetchingIdentificationTypes,
  fetched: state.medical.fetchedIdentificationTypes,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchIdentificationTypes }, dispatch);
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withModulesManager(IdentificationTypePicker)));
