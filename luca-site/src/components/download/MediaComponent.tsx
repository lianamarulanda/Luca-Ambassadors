import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
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
import { useTheme } from '@material-ui/core/styles';
import { DbContext } from '../../util/api';
import ImageUploader from 'react-images-upload';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const tileData = [
  {
    img: 'https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/105493832_300706381102703_8033152533069920244_n.jpg?_nc_cat=107&_nc_sid=8ae9d6&_nc_ohc=hOvdO7s3FEYAX_6AqKs&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=5998b19b1ca568da6bf0e62e934185f2&oe=5F2A06BB',
    featured: true,
    title: "Cool image 1",
  },
  {
    img: 'https://scontent.ftpa1-2.fna.fbcdn.net/v/t31.0-8/28701189_1600706866723663_4562909647058257910_o.jpg?_nc_cat=100&_nc_sid=9267fe&_nc_ohc=hxOiawgIUysAX9qCM0d&_nc_ht=scontent.ftpa1-2.fna&oh=a265ecaefd8ba15a377f9fc231508c88&oe=5F2C5564',
    featured: false,
    title: "Cool image 2",
  },
  {
    img: 'https://images-ext-1.discordapp.net/external/8E5Sflz8M9PoloEBXSVxPLtrkDPyOkUG1t4tSL1xKVk/%3F_nc_cat%3D109%26_nc_sid%3D2c4854%26_nc_ohc%3DMujlhrh4IG4AX9jDFvN%26_nc_ht%3Dscontent.ftpa1-1.fna%26oh%3D60e421f601cee23e50354377c1e7f53b%26oe%3D5F2C03F3/https/scontent.ftpa1-1.fna.fbcdn.net/v/t31.0-8/21125796_1417378191723199_1715898478894948298_o.jpg?width=879&height=940',
    featured: true,
    title: "Cool image 3",
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/94640842_2812739828853688_8871817667913187328_o.jpg?_nc_cat=108&_nc_sid=9267fe&_nc_ohc=brEgOpmYQMAAX91bnDr&_nc_ht=scontent.ftpa1-1.fna&oh=4da72cc664ff59e3d53e801ce3f60dc9&oe=5F29694E',
    featured: false,
    title: "Cool image 4",
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/78647683_2535062266621447_2074910267044528128_o.jpg?_nc_cat=101&_nc_sid=9267fe&_nc_ohc=SI-6Nh3iR6kAX9WQmIs&_nc_ht=scontent.ftpa1-1.fna&oh=72317e31ca8005c1f63ff2ee04e3ae40&oe=5F2911EE',
    featured: false,
    title: "Cool image 5",
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/69618114_2334496703344672_3688484619218321408_o.jpg?_nc_cat=107&_nc_sid=9267fe&_nc_ohc=g4KYOC-QwMUAX_G8pvl&_nc_ht=scontent.ftpa1-1.fna&oh=f7076382ead108e17938565b5d5ad740&oe=5F2BEAF2',
    featured: false,
    title: "Cool image 6",
  },
  {
    img: 'https://scontent.ftpa1-2.fna.fbcdn.net/v/t1.0-9/59928247_2143993169061694_7264478461496918016_o.jpg?_nc_cat=100&_nc_sid=9267fe&_nc_ohc=Ty4VKmUJfNIAX_zClwn&_nc_ht=scontent.ftpa1-2.fna&oh=2ca5ba75a036f8c40804892af592643b&oe=5F2A895C',
    featured: false,
    title: "Cool image 7",
  },
  {
    img: 'https://scontent.ftpa1-2.fna.fbcdn.net/v/t1.0-9/67519074_2265612426899767_5631869385497903104_o.jpg?_nc_cat=103&_nc_sid=9267fe&_nc_ohc=zOOJRYoIvkIAX_c931O&_nc_ht=scontent.ftpa1-2.fna&oh=7aff3102c7aa0cf80132b67960e5a1b2&oe=5F2982EB',
    featured: false,
    title: "Cool image 8",
  },
  {
    img: 'https://scontent.ftpa1-1.fna.fbcdn.net/v/t1.0-9/73153144_2408500869277588_9015068077208895488_n.jpg?_nc_cat=110&_nc_sid=9267fe&_nc_ohc=xKNhph41xQwAX9fK4x5&_nc_ht=scontent.ftpa1-1.fna&oh=124c5590a82535db8bad767245c53a9b&oe=5F2AC63F',
    featured: false,
    title: "Cool image 9",
  }
];

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
      picture: uploadedPicture[uploadedPicture.length-1],
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
          { error !== "" &&
            <Typography variant="overline" color="error" display="block" gutterBottom>
              { error }
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
        <DialogContent style={{justifyContent:"center"}}>
          <DialogContentText>
            If an image with the same file name has already been uploaded,
            <br/>
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
          { message !== "" &&
            <Typography variant="overline" className={classes.uploadSuccess} gutterBottom>
              { message }
            </Typography>
          }
          { error !== "" &&
            <Typography variant="overline" color="error" display="block" gutterBottom>
              { error }
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
      <Grid container style={{backgroundColor:'#FAFAFA', justifyContent: 'center', justifyItems:'space-in-between', marginBottom:'20px'}}>
        { props.adminStatus &&
          <Button variant="contained" onClick={() => openDialogForm()}>Upload Media</Button>
        }
      </Grid>
      <GridList cellHeight={400} spacing={1} className={classes.gridList} cols={props.content.length <= 1 ? 1 : 3}>
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