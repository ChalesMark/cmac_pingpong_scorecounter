import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Select, MenuItem } from "@material-ui/core";
import { Colors, Styles } from "./GlobalStyles";
import Modal from "react-modal";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteIcon from "@material-ui/icons/Delete";

Modal.setAppElement("*");
const Counter = (props) => {
  const [people, setPeople] = useState(null);
  const [creationMode, setCreationMode] = useState(false);

  const [addPersonName, setAddPersonName] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editPersonID, setEditPersonID] = useState("");
  const [editPersonName, setEditPersonName] = useState("");
  const [editPersonWins, setEditPersonWins] = useState(0);
  const [editPersonLosses, setEditPersonLosses] = useState(0);

  const [deleteMode, setDeleteMode] = useState(false);
  const [sorting, setSorting] = useState(0);

  useEffect(() => {
    if (props.counter != null) LoadPeople();
    // Comment thing
  }, []);

  const setEditPerson = (p) => {
    setEditPersonID(p.id);
    setEditPersonName(p.name);
    setEditPersonWins(p.wins);
    setEditPersonLosses(p.losses);
    setEditMode(true);
  };

  const DeleteMode = (u) => {
    setEditMode(!u);
    setDeleteMode(u);
  };

  const Sort = (s) => {
    var tempPeople = [...people];
    switch (s) {
      case 1:
        tempPeople.sort(function (a, b) {
          if (a.wins > b.wins) {
            return -1;
          }
          if (a.wins < b.wins) {
            return 1;
          }
          return 0;
        });
        break;
      case 2:
        tempPeople.sort(function (a, b) {
          if (a.losses > b.losses) {
            return -1;
          }
          if (a.losses < b.losses) {
            return 1;
          }
          return 0;
        });
        break;
      case 3:
        tempPeople.sort(function (a, b) {
          if (
            (a.wins / (a.wins + a.losses)) * 100 >
            (b.wins / (b.wins + b.losses)) * 100
          ) {
            return -1;
          }
          if (
            (a.wins / (a.wins + a.losses)) * 100 <
            (b.wins / (b.wins + b.losses)) * 100
          ) {
            return 1;
          }
          return 0;
        });
        break;
      case 4:
        tempPeople.sort(function (a, b) {
          if (
            (a.wins / (a.wins + a.losses)) * 100 <
            (b.wins / (b.wins + b.losses)) * 100
          ) {
            return -1;
          }
          if (
            (a.wins / (a.wins + a.losses)) * 100 >
            (b.wins / (b.wins + b.losses)) * 100
          ) {
            return 1;
          }
          return 0;
        });
        break;
    }

    setPeople(tempPeople);
  };

  const UpdatePerson = async () => {
    await props.firestore.collection("People").doc(editPersonID).update({
      name: editPersonName,
      wins: editPersonWins,
      losses: editPersonLosses,
    });
    setEditMode(false);
    Sort();
    LoadPeople();
  };

  const DeletePerson = async () => {
    await props.firestore.collection("People").doc(editPersonID).delete();
    setEditPersonName("");
    setEditPersonWins(0);
    setEditPersonLosses(0);
    setEditMode(false);
    setDeleteMode(false);

    LoadPeople();
  };

  const AddPerson = async () => {
    await props.firestore
      .collection("People")
      .add({})
      .then(function (doc) {
        props.firestore.collection("People").doc(doc.id).set({
          id: doc.id,
          counterID: props.counter.id,
          name: addPersonName,
          wins: 0,
          losses: 0,
        });
      });
    setAddPersonName("");
    LoadPeople();
    setCreationMode(false);
  };

  const LoadPeople = async () => {
    let tempPeople = [];
    const data = await props.firestore
      .collection("People")
      .where("counterID", "==", props.counter.id)
      .get();

    data.forEach((doc) => {
      tempPeople.push(doc.data());
    });
    setPeople(tempPeople);
  };

  return (
    <div>
      <Modal
        isOpen={deleteMode}
        onRequestClose={() => DeleteMode(false)}
        style={modalStyle}
        animationType={"slide"}
      >
        Are you sure you want to delete {editPersonName}?
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <Button
            style={{ backgroundColor: Colors.confirm, width: 100, margin: 20 }}
            onClick={() => DeletePerson()}
          >
            Yes
          </Button>
          <Button
            style={{ backgroundColor: Colors.decline, width: 100, margin: 20 }}
            onClick={() => DeleteMode(false)}
          >
            No
          </Button>
        </Grid>
      </Modal>

      <Modal
        isOpen={editMode}
        onRequestClose={() => UpdatePerson()}
        style={modalStyle}
        animationType={"slide"}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ width: "90%", margin: 20, fontSize: 30 }}
          >
            <TextField
              label="Name"
              variant="outlined"
              value={editPersonName}
              onChange={(e) => setEditPersonName(e.target.value)}
            />
            <Button onClick={() => DeleteMode(true)}>
              <DeleteIcon />
            </Button>
          </Grid>
          Wins
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            style={{ marginBottom: 20 }}
          >
            <Button onClick={() => setEditPersonWins(editPersonWins - 1)}>
              <RemoveIcon />
            </Button>
            {editPersonWins}
            <Button onClick={() => setEditPersonWins(editPersonWins + 1)}>
              <AddIcon />
            </Button>
          </Grid>
          Losses
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Button onClick={() => setEditPersonLosses(editPersonLosses - 1)}>
              <RemoveIcon />
            </Button>
            {editPersonLosses}
            <Button onClick={() => setEditPersonLosses(editPersonLosses + 1)}>
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
      </Modal>

      <Modal
        isOpen={creationMode}
        onRequestClose={() => setCreationMode(false)}
        style={modalStyle}
        animationType={"slide"}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <TextField
            label="Participant's Name"
            variant="outlined"
            value={addPersonName}
            onChange={(e) => setAddPersonName(e.target.value)}
          />
          <Button onClick={() => AddPerson()}>
            <AddIcon style={{ fontSize: 40 }} />
          </Button>
        </Grid>
      </Modal>

      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        style={{ alignItems: "center", paddingTop: 20, paddingBottom: 20 }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          style={{
            width: "80%",
          }}
        >
          <Button onClick={() => props.return()}>
            <ArrowBackIosIcon fontSize="large" />
          </Button>

          <Button
            variant="contained"
            style={Styles.FullButtonConfirmNoFullWidth}
            onClick={() => setCreationMode(true)}
          >
            Add New Participant
          </Button>
        </Grid>

        <Select
          value={sorting}
          onChange={(e) => {
            setSorting(e.target.value);
            Sort(e.target.value);
          }}
          disableUnderline={true}
          variant="outlined"
          style={{ marginTop: 20, width: "80%", padding: 5 }}
        >
          <MenuItem value={1}>Wins</MenuItem>
          <MenuItem value={2}>Losses</MenuItem>
          <MenuItem value={3}>Highest Average</MenuItem>
          <MenuItem value={4}>Lowest Average</MenuItem>
        </Select>
        {people != null ? (
          <div style={{ width: "80%", margin: 10, alignItems: "center" }}>
            {people.length != 0 ? (
              <table>
                <thead>
                  <tr>
                    <td width="300" style={Styles.TableHeaders}>
                      Name
                    </td>
                    <td width="200" style={Styles.TableHeaders}>
                      Win/Loss
                    </td>
                    <td width="200" style={Styles.TableHeaders}>
                      Win %
                    </td>
                    <td width="100" style={Styles.TableHeaders}></td>
                  </tr>
                </thead>
                <tbody>
                  {people.map((p, index) => (
                    <tr key={index}>
                      <td>{p.name}</td>
                      <td>
                        {p.wins} / {p.losses}
                      </td>
                      <td
                        style={{
                          color:
                            ((p.wins / (p.wins + p.losses)) * 100).toFixed(2) >
                            50
                              ? Colors.winning
                              : ((p.wins / (p.wins + p.losses)) * 100).toFixed(
                                  2
                                ) < 50
                              ? Colors.lossing
                              : "black",
                        }}
                      >
                        {((p.wins / (p.wins + p.losses)) * 100).toFixed(2)} %
                      </td>
                      <td>
                        <Button onClick={() => setEditPerson(p)}>
                          <MoreHorizIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: "center" }}>
                You have no participants :c
              </div>
            )}
          </div>
        ) : null}
      </Grid>
    </div>
  );
};

const modalStyle = {
  content: {
    width: "80%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    textAlign: "center",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

export default Counter;
