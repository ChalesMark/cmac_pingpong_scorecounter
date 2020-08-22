import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import { Colors, Styles } from "./GlobalStyles";
import Modal from "react-modal";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
Modal.setAppElement("*");
const CounterSelection = (props) => {
  const [counters, setCounters] = useState(null);
  const [creationMode, setCreationMode] = useState(false);

  const [counterName, setCounterName] = useState("");

  const [deleteMode, setDeleteMode] = useState(null);

  useEffect(() => {
    LoadCounters();
    // Comment thing
  }, []);

  const DeleteCounter = async () => {
    await props.firestore.collection("Counters").doc(deleteMode.id).delete();
    await props.firestore
      .collection("People")
      .where("counterID", "==", deleteMode.id)
      .get()
      .then(function (file) {
        file.forEach(function (f) {
          f.ref.delete();
        });
      });

    setDeleteMode(null);
    LoadCounters();
  };

  const CreateCounter = async () => {
    await props.firestore
      .collection("Counters")
      .add({})
      .then(function (doc) {
        props.firestore.collection("Counters").doc(doc.id).set({
          id: doc.id,
          uid: props.uid,
          name: counterName,
        });
      });
    LoadCounters();
    setCreationMode(false);
  };

  const LoadCounters = async () => {
    let tempCounters = [];
    const data = await props.firestore
      .collection("Counters")
      .where("uid", "==", props.uid)
      .get();

    data.forEach((doc) => {
      tempCounters.push(doc.data());
    });
    await setCounters(tempCounters);
  };

  return (
    <div style={{ paddingTop: 50 }}>
      {deleteMode != null ? (
        <Modal
          isOpen={deleteMode != null}
          onRequestClose={() => setDeleteMode(null)}
          style={modalStyle}
          animationType={"slide"}
        >
          Are you sure you want to delete {deleteMode.name}?
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Button
              style={{
                backgroundColor: Colors.confirm,
                width: 100,
                margin: 20,
              }}
              onClick={() => DeleteCounter()}
            >
              Yes
            </Button>
            <Button
              style={{
                backgroundColor: Colors.decline,
                width: 100,
                margin: 20,
              }}
              onClick={() => deleteMode(null)}
            >
              No
            </Button>
          </Grid>
        </Modal>
      ) : null}

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
            label="Counter Name"
            variant="outlined"
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
          />
          <Button onClick={() => CreateCounter()}>
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
        <Button
          variant="contained"
          style={Styles.FullButtonConfirm}
          onClick={() => setCreationMode(true)}
        >
          Add New Counter
        </Button>
        {counters != null ? (
          <div style={{ width: "80%", margin: 10 }}>
            {counters.length != 0 ? (
              <div>
                <div style={{ textAlign: "center" }}>Your Counters</div>
                {counters.map((p, index) => (
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    key={{ index }}
                    style={{ width: "100%", marginTop: 10 }}
                  >
                    <Button
                      variant="contained"
                      style={Styles.Counter}
                      onClick={() => props.OpenCounter(p)}
                    >
                      {p.name}
                    </Button>
                    <Button onClick={() => setDeleteMode(p)}>
                      <DeleteIcon style={{ color: Colors.decline }} />
                    </Button>
                  </Grid>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>You have no counters :c</div>
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

export default CounterSelection;
