import React, { createRef } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography, Divider, Checkbox, FormControlLabel, Button } from "@material-ui/core";
import {
  formatMessage,
  withTooltip,
  FormattedMessage,
  PublishedComponent,
  FormPanel,
  TextInput,
  Contributions,
  withModulesManager,
} from "@openimis/fe-core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { QRCodeCanvas } from 'qrcode.react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Alert from '@material-ui/lab/Alert';
const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});
import { DEFAULT, disabilityStatusOptions, INSUREE_ACTIVE_STRING } from "../constants";

const INSUREE_INSUREE_CONTRIBUTION_KEY = "insuree.Insuree";
const INSUREE_INSUREE_PANELS_CONTRIBUTION_KEY = "insuree.Insuree.panels";

class InsureeMasterPanel extends FormPanel {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  constructor(props) {
    super(props);
    this.isInsureeStatusRequired = props.modulesManager.getConf(
      "fe-insuree",
      "insureeForm.isInsureeStatusRequired",
      false,
    );
    this.renderLastNameFirst = props.modulesManager.getConf(
      "fe-insuree",
      "renderLastNameFirst",
      DEFAULT.RENDER_LAST_NAME_FIRST,
    );
    this.divRef = createRef();
  }

  handleDownloadPDF = () => {
    const input = this.divRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("downloaded-content.pdf");
    });
  };

  renderLastNameField = (edited, classes, readOnly) => {
    return (
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="insuree"
          label="Insuree.lastName"
          required={true}
          readOnly={readOnly}
          value={!!edited && !!edited.lastName ? edited.lastName : ""}
          onChange={(v) => this.updateAttribute("lastName", v)}
        />
      </Grid>
    );
  };

  renderGivenNameField = (edited, classes, readOnly) => (
    <Grid item xs={3} className={classes.item}>
      <TextInput
        module="insuree"
        label="Insuree.otherNames"
        required={true}
        readOnly={readOnly}
        value={!!edited && !!edited.otherNames ? edited.otherNames : ""}
        onChange={(v) => this.updateAttribute("otherNames", v)}
      />
    </Grid>
  );

  renderMiddleNameField = (edited, classes, readOnly) => (
    <Grid item xs={2} className={classes.item}>
      <TextInput
        module="insuree"
        label="Insuree.middleNames"
        required={true}
        readOnly={readOnly}
        value={!!edited && !!edited.middleName ? edited.middleName : ""}
        onChange={(v) => this.updateAttribute("middleName", v)}
      />
    </Grid>
  );


  render() {
    const {
      intl,
      classes,
      edited,
      title = "Insuree.title",
      titleParams = { label: "" },
      readOnly = true,
      actions,
      editedId,
      canRegister
    } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container className={classes.tableTitle}>
              <Grid item xs={3} container alignItems="center" className={classes.item}>
                <Typography variant="h5">
                  <FormattedMessage module="insuree" id={title} values={titleParams} />
                </Typography>

              </Grid>
              <Grid item xs={9}>
                <Grid container justify="flex-end" spacing={2}>
                  <Grid item xs={2}>  
                  {!!edited && !!edited.chfId ? <Button variant="outlined" color="primary" px={2} onClick={this.handleClickOpen}>
                    Generate QR Code
                  </Button> : ""}
                  </Grid>
                <Grid container justify="flex-end">
                  {!!edited &&
                    !!edited.family &&
                    !!edited.family.headInsuree &&
                    edited.family.headInsuree.id !== edited.id && (
                      <Grid item xs={3}>
                        <PublishedComponent
                          pubRef="insuree.RelationPicker"
                          withNull={true}
                          nullLabel={formatMessage(this.props.intl, "insuree", `Relation.none`)}
                          readOnly={readOnly}
                          value={!!edited && !!edited.relationship ? edited.relationship.id : ""}
                          onChange={(v) => this.updateAttribute("relationship", { id: v })}
                        />
                      </Grid>
                    )}
                  {!!actions &&
                    actions.map((a, idx) => {
                      return (
                        <Grid item key={`form-action-${idx}`} className={classes.paperHeaderAction}>
                          {withTooltip(a.button, a.tooltip)}
                        </Grid>
                      );
                    })}

                </Grid>
                <Grid container justify="flex-end" >
                  <Grid item xs={3}>
                    <Dialog
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">Qr Code for {edited?.chfId}</DialogTitle>
                      <DialogContent>
                        <div ref={this.divRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                          <QRCodeCanvas value={edited?.chfId} />
                          <p>Name: {!!edited && !!edited.otherNames ? edited.otherNames : ""}{!!edited && !!edited.lastName ? edited.lastName : ""}</p>
                          <p>Id: {edited?.chfId}</p>
                        </div>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleDownloadPDF} color="primary">
                          Download
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Grid container className={classes.item}>
              {!!edited && !!edited.chfId ?
                <Grid item xs={4} className={classes.item}>
                  <PublishedComponent
                    pubRef="insuree.InsureeNumberInput"
                    module="insuree"
                    label="Insuree.chfId"
                    required={true}
                    readOnly={true}
                    value={edited?.chfId}
                    editedId={editedId}
                    onChange={(v) => this.updateAttribute("chfId", v)}
                  />
                </Grid>
                : (
                  ""
                )}
              {this.renderLastNameFirst ? (
                <>
                  {this.renderGivenNameField(edited, classes, readOnly)}
                  {this.renderMiddleNameField(edited, classes, readOnly)}
                  {this.renderLastNameField(edited, classes, readOnly)}
                </>
              ) : (
                <>
                  {this.renderGivenNameField(edited, classes, readOnly)}
                  {this.renderMiddleNameField(edited, classes, readOnly)}
                  {this.renderLastNameField(edited, classes, readOnly)}
                </>
              )}
              <Grid item xs={8}>
                <Grid container>
                  <Grid item xs={8} className={classes.item}>
                    <PublishedComponent
                      pubRef="core.AgePicker"
                      value={!!edited ? edited.dob : null}
                      module="insuree"
                      label="Insuree.dob"
                      readOnly={readOnly}
                      required={true}
                      maxDate={new Date()}
                      onChange={(v) => this.updateAttribute("dob", v)}
                    />

                  </Grid>
                  {!!edited &&
                    !!edited.family &&
                    !!edited.family.headInsuree &&
                    edited.family.headInsuree.id !== edited.id &&
                    <Grid item xs={3} className={classes.item}>
                      <FormControl >
                        <InputLabel id="demo-simple-select-label">Disability Status </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          readOnly={readOnly}
                          value={!!edited && !!edited.disabilityStatus ? edited.disabilityStatus?.toLowerCase() : disabilityStatusOptions[0]}
                          onChange={(v) => {

                            this.updateAttribute("disabilityStatus", v.target.value)
                          }}
                        >
                          {disabilityStatusOptions.map((v) => (
                            <MenuItem key={v} value={v}>
                              {formatMessage(this.props.intl, "insuree", `DisabilityType.${v}`)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  }

                  <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.InsureeGenderPicker"
                      value={!!edited && !!edited.gender ? edited.gender.code : ""}
                      module="insuree"
                      readOnly={readOnly}
                      withNull={false}
                      required={true}
                      onChange={(v) => this.updateAttribute("gender", { code: v })}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.InsureeMaritalStatusPicker"
                      value={!!edited && !!edited.marital ? edited.marital : ""}
                      module="insuree"
                      readOnly={readOnly}
                      withNull={false}
                      onChange={(v) => this.updateAttribute("marital", v)}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={!!edited && !!edited.cardIssued}
                          disabled={readOnly}
                          onChange={(v) => this.updateAttribute("cardIssued", !edited || !edited.cardIssued)}
                        />
                      }
                      label={formatMessage(intl, "insuree", "Insuree.cardIssued")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PublishedComponent
                      pubRef="insuree.InsureeAddress"
                      value={edited}
                      module="insuree"
                      readOnly={readOnly}
                      onChangeLocation={(v) => this.updateAttribute("currentVillage", v)}
                      onChangeAddress={(v) => this.updateAttribute("currentAddress", v)}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.item}>
                    <TextInput
                      module="insuree"
                      label="Insuree.phone"
                      readOnly={readOnly}
                      value={!!edited && !!edited.phone ? edited.phone : ""}
                      onChange={(v) => this.updateAttribute("phone", v)}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.item}>
                    <TextInput
                      module="insuree"
                      label="Insuree.email"
                      readOnly={readOnly}
                      value={!!edited && !!edited.email ? edited.email : ""}
                      onChange={(v) => this.updateAttribute("email", v)}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.ProfessionPicker"
                      module="insuree"
                      value={!!edited && !!edited.profession ? edited.profession.id : null}
                      readOnly={readOnly}
                      withNull={false}
                      onChange={(v) => this.updateAttribute("profession", { id: v })}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.EducationPicker"
                      module="insuree"
                      value={!!edited && !!edited.education ? edited.education.id : ""}
                      readOnly={readOnly}
                      withNull={false}
                      onChange={(v) => this.updateAttribute("education", { id: v })}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.IdentificationTypePicker"
                      module="insuree"
                      value={!!edited && !!edited.typeOfId ? edited.typeOfId.code : null}
                      readOnly={readOnly}
                      withNull={false}
                      onChange={(v) => this.updateAttribute("typeOfId", { code: v })}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <TextInput
                      module="insuree"
                      label="Insuree.passport"
                      readOnly={readOnly}
                      value={!!edited && !!edited.passport ? edited.passport : ""}
                      onChange={(v) => this.updateAttribute("passport", !!v ? v : null)}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.InsureeStatusPicker"
                      label="Insuree.status"
                      value={edited?.status}
                      withNull={false}
                      module="insuree"
                      readOnly={!edited?.uuid || readOnly}
                      onChange={(v) => this.updateAttributes({ "status": v, "statusReason": null })}
                      required={this.isInsureeStatusRequired}
                    />
                  </Grid>
                  {!!edited?.status && edited?.status !== INSUREE_ACTIVE_STRING && (
                    <Grid item xs={3} className={classes.item}>
                      <PublishedComponent
                        pubRef="core.DatePicker"
                        label="Insuree.statusDate"
                        value={edited?.statusDate}
                        module="insuree"
                        readOnly={readOnly}
                        required={true}
                        onChange={(v) => this.updateAttribute("statusDate", v)}
                      />
                    </Grid>
                  )}
                  {!!edited?.status && edited?.status !== INSUREE_ACTIVE_STRING && (
                    <Grid item xs={3} className={classes.item}>
                      <PublishedComponent
                        pubRef="insuree.InsureeStatusReasonPicker"
                        label="Insuree.statusReason"
                        value={edited?.statusReason}
                        module="insuree"
                        readOnly={readOnly}
                        withNull={false}
                        statusType={edited.status}
                        required={true}
                        onChange={(v) => this.updateAttribute("statusReason", v)}
                      />
                    </Grid>
                  )}
                  {!!edited &&
                    !!edited.family &&
                    !!edited.family.headInsuree &&
                    edited.family.headInsuree.id !== edited.id &&
                    <Grid item xs={3} className={classes.item}>

                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={!!edited && !!edited.isActive}
                            disabled={readOnly}
                            onChange={(v) => this.updateAttribute("isActive", !edited || !edited.isActive)}
                          />
                        }
                        // label={formatMessage(intl, "insuree", "Insuree.cardIssued")}
                        label={"Active"}
                      />
                    </Grid>
                  }
                </Grid>
              </Grid>
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="insuree.Avatar"
                  photo={!!edited ? edited.photo : null}
                  readOnly={readOnly}
                  withMeta={true}
                  onChange={(v) => this.updateAttribute("photo", !!v ? v : null)}
                />
              </Grid>
              <Contributions
                {...this.props}
                updateAttribute={this.updateAttribute}
                contributionKey={INSUREE_INSUREE_CONTRIBUTION_KEY}
              />
              <Grid item xs={12} className={classes.item}>
                {canRegister ?   !canRegister?.startDate && !canRegister?.endDate ? (
                 <Alert variant="outlined" severity="warning">
                   Registration Start and end dates should be configured.
                 </Alert>
                ) : (
                   canRegister?.allowed ? "" : (
                    <Alert variant="outlined" severity="error">
                      The registration period has now ended. It was open from {canRegister?.startDate} to {canRegister?.endDate}.
                    </Alert>
                  )
                ) : ""}
              </Grid>
            </Grid>
          </Paper>
          <Contributions
            {...this.props}
            updateAttribute={this.updateAttribute}
            contributionKey={INSUREE_INSUREE_PANELS_CONTRIBUTION_KEY}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(InsureeMasterPanel)));
