import React from 'react';
import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DbContext } from '../../util/api';
import ImageUploader from 'react-images-upload';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
    },
    gridList: {
      width: 'auto',
      height: 'auto',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    titleBar: {
      background:
        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    tile: {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: theme.shadows[20],
      },
      color: '#FAFAFA'
    },
    image: {
      width: '100%',
      height: '100%'
    },
    button: {
      color: '#2E5941'
    },
    uploadSuccess: {
      color: '#2E5941'
    }
  }),
);


export default function ViewMediaComponent(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const api = React.useContext(DbContext);
  const [openPreview, setPreview] = React.useState(false);
  const [form, openForm] = React.useState(false);
  const [picture, setPicture] = React.useState(({
    pictureName: "",
    picture: "",
    title: ""
  }));
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const openPreviewDialog = (tile: any) => {
    if (!props.adminStatus) {
      window.open(tile.url, '_blank');
    } else {
      setPicture({
        ...picture,
        pictureName: tile.name,
        picture: tile.url,
        title: tile.title,
      })
      setPreview(true);
    }
  }
  const closePreview = () => {
    setPicture({
      ...picture,
      pictureName: "",
      picture: "",
      title: ""
    });
    setPreview(false);
    setError("");
  };

  const openDialogForm = () => {
    openForm(true);
  }
  const handleFormClose = () => {
    setPicture({
      ...picture,
      pictureName: "",
      picture: "",
      title: ""
    });

    openForm(false);
    setMessage("");
    setError("");
  }

  const deletePhoto = () => {
    api.deletePhoto(picture)
      .then(() => {
        window.location.reload(false);
      }).catch((error: string) => {
        setError(error);
      })
  }

  const uploadPhoto = async (uploadedPicture: any) => {
    setPicture({
      ...picture,
      pictureName: uploadedPicture[uploadedPicture.length - 1]['name'],
      picture: uploadedPicture[uploadedPicture.length - 1],
    });
    setMessage("Image successfully attached!");
  }

  const submitUpload = async () => {
    api.uploadPhoto(picture)
      .then(() => {
        window.location.reload(false);
      })
      .catch((error: string) => {
        setError(error);
      })
  }

  const uploadTitle = (event: any) => {
    setPicture({
      ...picture,
      [event.target.name]: event.target.value.trim()
    })
  }

  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={openPreview}
        onClose={closePreview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete this media content?
        </DialogTitle>
        <DialogContent>
          <img src={picture.picture} alt="image" className={classes.image} />
          {error !== "" &&
            <Typography variant="overline" color="error" display="block" gutterBottom>
              {error}
            </Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview} className={classes.button}>
            Cancel
          </Button>
          <Button onClick={deletePhoto} className={classes.button} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={form}
        onClose={handleFormClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Upload Media
        </DialogTitle>
        <DialogContent style={{ justifyContent: "center" }}>
          <DialogContentText>
            If an image with the same file name has already been uploaded,
            <br />
            it will get replaced
          </DialogContentText>
          <TextField
            required
            id="filled-required"
            label="Photo Title"
            name="title"
            onChange={uploadTitle}
          />
          <ImageUploader
            withIcon={true}
            buttonText='Choose image'
            onChange={uploadPhoto}
            imgExtension={['.jpg', '.png', '.jpeg']}
            singleImage={true}
            maxFileSize={5242880}
            label='Max file size: 5mb | Accepted: png, jpg, jpeg'
          />
          {message !== "" &&
            <Typography variant="overline" className={classes.uploadSuccess} gutterBottom>
              {message}
            </Typography>
          }
          {error !== "" &&
            <Typography variant="overline" color="error" display="block" gutterBottom>
              {error}
            </Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} className={classes.button}>
            Cancel
          </Button>
          <Button onClick={submitUpload} className={classes.button} autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container style={{ marginTop: '20px', justifyContent: 'center', justifyItems: 'space-in-between', marginBottom: '20px' }}>
        {props.adminStatus &&
          <Button variant="contained" onClick={() => openDialogForm()}>Upload Media</Button>
        }
      </Grid>
      <GridList cellHeight={400} spacing={1} className={classes.gridList} cols={fullScreen ? 1 : 3}>
        {props.content.map((tile: any) => (
          <GridListTile key={tile.title} cols={1} rows={1} className={classes.tile} onClick={() => openPreviewDialog(tile)}>
            <img src={tile.url} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              titlePosition="top"
              className={classes.titleBar}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}