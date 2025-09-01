import React, { Component } from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  withModulesManager,
  formatMessage,
  Contributions,
  PublishedComponent,
  ControlledField,
  TextInput,
} from "@openimis/fe-core";
import { DEFAULT, WITHOUT_STR } from "../constants";

const styles = (theme) => ({
  dialogTitle: theme.dialog.title,
  dialogContent: theme.dialog.content,
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
  paperDivider: theme.paper.divider,
});

const INSUREE_FILTER_CONTRIBUTION_KEY = "insuree.Filter";

class InsureeFilter extends Component {
  constructor(props) {
    super(props);
    this.renderLastNameFirst = props.modulesManager.getConf(
      "fe-insuree",
      "renderLastNameFirst",
      DEFAULT.RENDER_LAST_NAME_FIRST,
    );
  }
  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf("fe-insuree", "debounceTime", 200),
  );

  _filterValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : null;
  };

  _filterTextFieldValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : "";
  };

  _onChangeCheckbox = (key, value) => {
    let filters = [
      {
        id: key,
        value: value,
        filter: `${key}: ${value}`,
      },
    ];
    this.props.onChangeFilters(filters);
  };

  renderLastNameField = () => {
    const { classes } = this.props;
    return (
      <ControlledField
        module="insuree"
        id="InsureeFilter.lastName"
        field={
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="insuree"
              label="Insuree.lastName"
              name="lastName"
              value={this._filterTextFieldValue("lastName")}
              onChange={(v) =>
                this.debouncedOnChangeFilter([
                  {
                    id: "lastName",
                    value: v,
                    filter: `lastName_Icontains: "${v}"`,
                  },
                ])
              }
            />
          </Grid>
        }
      />
    );
  };

  renderGivenNameField = () => {
    const { classes } = this.props;
    return (
      <ControlledField
        module="insuree"
        id="InsureeFilter.givenName"
        field={
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="insuree"
              label="Insuree.otherNames"
              name="givenName"
              value={this._filterTextFieldValue("givenName")}
              onChange={(v) =>
                this.debouncedOnChangeFilter([
                  {
                    id: "givenName",
                    value: v,
                    filter: `otherNames_Icontains: "${v}"`,
                  },
                ])
              }
            />
          </Grid>
        }
      />
    );
  };

  render() {
    const { intl, classes, filters, onChangeFilters } = this.props;
    return (
      <Grid container className={classes.form}>
        <ControlledField
          module="insuree"
          id="InsureeFilter.location"
          field={
            <Grid item xs={12}>
              <PublishedComponent
                pubRef="location.DetailedLocationFilter"
                withNull={true}
                filters={filters}
                onChangeFilters={onChangeFilters}
                anchor="parentLocation"
              />
            </Grid>
          }
        />
        <ControlledField
          module="insuree"
          id="InsureeFilter.chfId"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module="insuree"
                label="Insuree.chfId"
                name="chfId"
                value={this._filterTextFieldValue("chfId")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    {
                      id: "chfId",
                      value: v,
                      filter: `chfId_Istartswith: "${v}"`,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
      
        <ControlledField
          module="insuree"
          id="InsureeFilter.phone"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module="insuree"
                label="Insuree.phone"
                name="phone"
                value={this._filterTextFieldValue("phone")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    {
                      id: "phone",
                      value: v,
                      filter: `phone_Icontains: "${v}"`,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="insuree"
          id="InsureeFilter.familyStatus"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="insuree.FamilyStatusPicker"
                value={this._filterValue("familyStatus")}
                onChange={(s) =>
                  onChangeFilters([
                    {
                      id: "familyStatus",
                      value: s,
                      filter: `family_Isnull: ${s === WITHOUT_STR}`,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        
        <Grid item xs={3}>
          <Grid container>
            <ControlledField
              module="insuree"
              id="InsureeFilter.photoStatus"
              field={
                <Grid item xs={6} className={classes.item}>
                  <PublishedComponent
                    pubRef="insuree.PhotoStatusPicker"
                    value={this._filterValue("photoStatus")}
                    onChange={(s) =>
                      onChangeFilters([
                        {
                          id: "photoStatus",
                          value: s,
                          filter: `photo_Isnull: ${s === WITHOUT_STR}`,
                        },
                      ])
                    }
                  />
                </Grid>
              }
            />
          </Grid>
        </Grid>
        <Contributions
          filters={filters}
          onChangeFilters={onChangeFilters}
          contributionKey={INSUREE_FILTER_CONTRIBUTION_KEY}
        />
      </Grid>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(InsureeFilter))));
