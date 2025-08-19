import React from "react";

import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { FormattedMessage, PublishedComponent, FormPanel } from "@openimis/fe-core";

const styles = (theme) => ({
  paper: theme.paper.paper,
  title: theme.paper.title,
  item: theme.paper.item,
});

class InsureeFirstServicePointPanel extends FormPanel {
  render() {
    const { classes, updateAttribute, readOnly, edited } = this.props;
    let isInsureeFirstServicePointRequired = this.props.modulesManager.getConf("fe-insuree", "insureeForm.isInsureeFirstServicePointRequired", false);
    return (
      <></>
    );
  }
}

export default withTheme(withStyles(styles)(InsureeFirstServicePointPanel));
