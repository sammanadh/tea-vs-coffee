import {
  Avatar,
  Box,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { formatWithCommas, percentize } from "../utils";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 48,
    width: 48,
    borderRadius: "initial",
    "&.left": {
      marginRight: theme.spacing(0.5),
    },
    "&.right": {
      marginLeft: theme.spacing(0.5),
    },
  },
  progress: {
    backgroundColor: theme.palette.primary.main,
    height: 25,
  },
}));

// Show vote counts for each side
export default function VoteTally({ votes }) {
  const classes = useStyles();

  function getProgress() {
    if (
      typeof votes.tea !== "number" ||
      typeof votes.coffee !== "number" ||
      votes.tea + votes.coffee === 0
    ) {
      return 50;
    }
    return (votes.tea / (votes.coffee + votes.tea)) * 100;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" marginBottom="5px">
        <Box display="flex" alignItems="flex-end">
          <Avatar
            alt=""
            src="/images/tea-icon.png"
            className={[classes.avatar, "left"].join(" ")}
          />
          <Typography variant="h6">Team tea</Typography>
        </Box>
        <Box display="flex" alignItems="flex-end" textAlign="right">
          <Typography variant="h6">Team coffee</Typography>
          <Avatar
            alt=""
            src="/images/coffee-icon.png"
            className={[classes.avatar, "right"].join(" ")}
          />
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={getProgress()}
        color="secondary"
        className={classes.progress}
      />
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="h3">
            {formatWithCommas(votes.tea)}
          </Typography>
          <Typography variant="h6">
            {percentize(votes.tea / (votes.tea + votes.coffee))}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h3">{formatWithCommas(votes.coffee)}</Typography>
          <Typography variant="h6">
            {percentize(votes.coffee / (votes.tea + votes.coffee))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
