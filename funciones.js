import { getData, remove, save, selectOne, edit, runExists } from "./firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    let id = 0;

    document.getElementById('btnGuardar').addEventListener('click', () => {
        document.querySelectorAll('.form-control').forEach(item => {
            verificar(item.id);
        });
    
        if (document.querySelectorAll('.is-invalid').length === 0) {
            const entrada = {
                run: document.getElementById('run').value.trim(),
                peli: document.getElementById('peli').value,
                fecha: document.getElementById('fecha').value,
                email: document.getElementById('email').value,
                fono: document.getElementById('fono').value,
                cantidad: document.getElementById('cantidad').value,
                precio: document.getElementById('precio').value
            };
    
            // Si se está editando un registro existente, excluye el RUN actual del chequeo
            const runToCheck = (id === 0) ? entrada.run : null;
    
            runExists(runToCheck).then(exists => {
                if (exists) {
                    Swal.fire({
                        title: "Error!",
                        text: "El RUN ya existe en la base de datos",
                        icon: "error"
                    });
                } else {
                    Swal.fire({
                        title: "¿Está seguro que desea guardar el registro?",
                        text: "Confirme que desea guardar los cambios",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Guardar",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (document.getElementById('btnGuardar').value === 'Guardar') {
                                save(entrada).then(() => {
                                    Swal.fire({
                                        title: "Guardado!",
                                        text: "Su registro ha sido guardado exitosamente!",
                                        icon: "success"
                                    });
                                }).catch((error) => {
                                    Swal.fire({
                                        title: "Error!",
                                        text: "Hubo un problema al guardar su registro: " + error.message,
                                        icon: "error"
                                    });
                                });
                            } else {
                                console.log('ID a editar:', id); // Depuración: verificar ID antes de editar
                                console.log('Entradas a actualizar:', entrada); // Depuración: verificar datos antes de editar
                                edit(id, entrada).then(() => {
                                    Swal.fire({
                                        title: "Actualizado!",
                                        text: "Su registro ha sido actualizado exitosamente!",
                                        icon: "success"
                                    });
                                    id = 0;
                                    limpiar();
                                }).catch((error) => {
                                    Swal.fire({
                                        title: "Error!",
                                        text: "Hubo un problema al actualizar su registro: " + error.message,
                                        icon: "error"
                                    });
                                });
                            }
                        }
                    });
                }
            }).catch((error) => {
                Swal.fire({
                    title: "Error!",
                    text: "Hubo un problema al verificar el RUN: " + error.message,
                    icon: "error"
                });
            });
        }
    });

function limpiar() {
    const formulario = document.getElementById('formulario');
        if (formulario) {
            formulario.reset();
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            document.getElementById('btnGuardar').value = 'Guardar';
        }
}
    
    

getData((datos) => {
        let tabla = '';
        datos.forEach((doc) => {
            const item = doc.data();
            tabla += `<tr>
                <td>${item.peli}</td>
                <td>${item.run}</td>
                <td>${item.fecha}</td>
                <td>${item.email}</td>
                <td>${item.fono}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio}</td>
                <td nowrap>
                    <button class="btn btn-warning" id="edit-${doc.id}">Editar</button>
                    <button class="btn btn-danger" id="delete-${doc.id}">Eliminar</button>
                </td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;

        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                const recordId = btn.id.replace('delete-', '');
                Swal.fire({
                    title: "¿Está seguro que desea eliminar el registro?",
                    text: "No podrá revertir los cambios",
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        remove(recordId).then(() => {
                            Swal.fire({
                                title: "Eliminado!",
                                text: "Su registro ha sido eliminado!",
                                icon: "success"
                            });
                        }).catch((error) => {
                            Swal.fire({
                                title: "Error!",
                                text: "Hubo un problema al eliminar su registro: " + error.message,
                                icon: "error"
                            });
                        });
                    }
                });
            });
        });


 document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', () => {
                const recordId = btn.id.replace('edit-', '');
                selectOne(recordId).then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        id = recordId;
                        document.getElementById('peli').value = data.peli;
                        document.getElementById('run').value = data.run;
                        document.getElementById('email').value = data.email;
                        document.getElementById('fecha').value = data.fecha;
                        document.getElementById('fono').value = data.fono;
                        document.getElementById('cantidad').value = data.cantidad;
                        document.getElementById('precio').value = data.precio;
                        document.getElementById('btnGuardar').value = 'Actualizar';
                    }
                }).catch((error) => {
                    Swal.fire({
                        title: "Error!",
                        text: "Hubo un problema al seleccionar su registro: " + error.message,
                        icon: "error"
                    });
                });
            });
        });
    });
});
