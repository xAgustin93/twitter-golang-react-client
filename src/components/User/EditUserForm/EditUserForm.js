import React, { useState, useCallback } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { API_HOST } from "../../../utils/constant";
import { Camera } from "../../../utils/Icons";
import {
  uploadBannerApi,
  uploadAvatarApi,
  updateInfoApi
} from "../../../api/user";

import "./EditUserForm.scss";

export default function EditUserForm(props) {
  const { user, setShowModal } = props;
  const [formData, setFormData] = useState(initialValue(user));
  const [bannerUrl, setBannerUrl] = useState(
    user?.banner ? `${API_HOST}/obtenerBanner?id=${user.id}` : null
  );
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar ? `${API_HOST}/obtenerAvatar?id=${user.id}` : null
  );
  const [avatarFile, setAvatarFile] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDropBanner = useCallback(acceptedFile => {
    const file = acceptedFile[0];
    setBannerUrl(URL.createObjectURL(file));
    setBannerFile(file);
  });
  const {
    getRootProps: getRootBannerProps,
    getInputProps: getInputBannerProps
  } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    multiple: false,
    onDrop: onDropBanner
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDropAvatar = useCallback(acceptedFile => {
    const file = acceptedFile[0];
    setAvatarUrl(URL.createObjectURL(file));
    setAvatarFile(file);
  });
  const {
    getRootProps: getRootAvatarProps,
    getInputProps: getInputAvatarProps
  } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    multiple: false,
    onDrop: onDropAvatar
  });

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (bannerFile) {
      uploadBannerApi(bannerFile).catch(() => {
        toast.error("Error al subir el nuevo banner");
      });
    }
    if (avatarFile) {
      uploadAvatarApi(avatarFile).catch(() => {
        toast.error("Error al subir el nuevo avatar");
      });
    }

    updateInfoApi(formData)
      .then(() => {
        setShowModal(false);
      })
      .catch(() => {
        toast.error("Error al actualizar los datos");
      })
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <div className="edit-user-form">
      <div
        className="banner"
        style={{ backgroundImage: `url('${bannerUrl}')` }}
        {...getRootBannerProps()}
      >
        <input {...getInputBannerProps()} />
        <Camera />
      </div>

      <div
        className="avatar"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
        {...getRootAvatarProps()}
      >
        <input {...getInputAvatarProps()} />
        <Camera />
      </div>

      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="nombre"
                defaultValue={formData.nombre}
                onChange={onChange}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Apellidos"
                name="apellidos"
                defaultValue={formData.apellidos}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Form.Control
            as="textarea"
            row="3"
            placeholder="Agrega tu biografía"
            type="text"
            name="biografia"
            defaultValue={formData.biografia}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Sitio web"
            name="sitioWeb"
            defaultValue={formData.sitioWeb}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <DatePicker
            placeholder="Fecha de nacimiento"
            locale={es}
            selected={new Date(formData.fechaNacimiento)}
            onChange={value =>
              setFormData({ ...formData, fechaNacimiento: value })
            }
          />
        </Form.Group>

        <Button className="btn-submit" variant="primary" type="submit">
          Actualizar
        </Button>
      </Form>
    </div>
  );
}

function initialValue(user) {
  return {
    nombre: user.nombre || "",
    apellidos: user.apellidos || "",
    biografia: user.biografia || "",
    ubicacion: user.ubicacion || "",
    sitioWeb: user.sitioWeb || "",
    fechaNacimiento: user.fechaNacimiento || ""
  };
}
