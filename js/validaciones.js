
const medicosPorEspecialidad = {
    "clinica": ["Dr. Gomez, Carlos", "Dra. Lopez, Maria"],
    "cardiologia": ["Dr. Perez, Juan", "Dra. Torres, Ana"],
    "pediatria": ["Dra. Diaz, Laura", "Dr. Soto, Pablo"],
    "ginecologia": ["Dra. Romero, Valeria", "Dra. Castro, Elena"],
    "traumatologia": ["Dr. Ramos, Sergio", "Dr. Herrera, Diego"],
    "neurologia": ["Dr. Molina, Andres", "Dra. Vargas, Cecilia"]
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-turnos");
    
    // Elementos Interactivos / Condicionales
    const especialidadSelect = document.getElementById("especialidad");
    const medicoSelect = document.getElementById("medico");
    
    const modalidadSelect = document.getElementById("modalidad");
    const grupoPlataforma = document.getElementById("grupo-plataforma");
    
    const coberturaSelect = document.getElementById("cobertura");
    const grupoCredencial = document.getElementById("grupo-credencial");
    const grupoPlan = document.getElementById("grupo-plan");
    
    const primeraVisitaCheck = document.getElementById("primera-visita");
    const grupoComoConocio = document.getElementById("grupo-como-conocio");
    
    const estudiosPreviosCheck = document.getElementById("estudios-previos");
    const grupoDescripcionEstudios = document.getElementById("grupo-descripcion-estudios");

    const mensajeExitoDiv = document.getElementById("mensaje-exito");

 
    // Control de Especialidad -> Médico
    especialidadSelect.addEventListener("change", () => {
        const esp = especialidadSelect.value;
        medicoSelect.innerHTML = '<option value="" disabled selected>Seleccione un médico</option>';
        
        if (esp && medicosPorEspecialidad[esp]) {
            medicoSelect.disabled = false;
            medicosPorEspecialidad[esp].forEach(medico => {
                const opt = document.createElement("option");
                opt.value = medico.toLowerCase().replace(/[^a-z]/g, ""); // normalizar value sencillo
                opt.textContent = medico;
                medicoSelect.appendChild(opt);
            });
        } else {
            medicoSelect.disabled = true;
        }
    });

    // Control Modalidad -> Plataforma Preferida
    modalidadSelect.addEventListener("change", () => {
        if (modalidadSelect.value === "videoconsulta") {
            grupoPlataforma.classList.remove("oculto");
            grupoPlataforma.classList.add("bloque");
        } else {
            grupoPlataforma.classList.add("oculto");
            grupoPlataforma.classList.remove("bloque");
            document.getElementById("plataforma").value = "";
        }
    });

    // Control Cobertura -> Credencial y Plan
    coberturaSelect.addEventListener("change", () => {
        if (coberturaSelect.value && coberturaSelect.value !== "particular") {
            grupoCredencial.classList.remove("oculto");
            grupoPlan.classList.remove("oculto");
            grupoCredencial.classList.add("bloque");
            grupoPlan.classList.add("bloque");
        } else {
            grupoCredencial.classList.add("oculto");
            grupoPlan.classList.add("oculto");
            grupoCredencial.classList.remove("bloque");
            grupoPlan.classList.remove("bloque");
            document.getElementById("credencial").value = "";
            document.getElementById("plan").value = "";
        }
    });

    // Control Primera Visita -> Cómo nos conoció
    primeraVisitaCheck.addEventListener("change", () => {
        if (primeraVisitaCheck.checked) {
            grupoComoConocio.classList.remove("oculto");
            grupoComoConocio.classList.add("bloque");
        } else {
            grupoComoConocio.classList.add("oculto");
            grupoComoConocio.classList.remove("bloque");
            document.getElementById("como-conocio").value = "";
        }
    });

    // Control Estudios Previos -> Descripción de Estudios
    estudiosPreviosCheck.addEventListener("change", () => {
        if (estudiosPreviosCheck.checked) {
            grupoDescripcionEstudios.classList.remove("oculto");
            grupoDescripcionEstudios.classList.add("bloque");
        } else {
            grupoDescripcionEstudios.classList.add("oculto");
            grupoDescripcionEstudios.classList.remove("bloque");
            document.getElementById("descripcion-estudios").value = "";
        }
    });

    // Limpieza de estilos al resetear
    form.addEventListener("reset", () => {
        const elementos = form.querySelectorAll("input, select, textarea");
        elementos.forEach(el => {
            el.classList.remove("campo-error", "campo-ok");
            const errDiv = el.parentElement.querySelector(".error-container");
            if (errDiv) errDiv.innerHTML = "";
        });
        medicoSelect.disabled = true;
        grupoPlataforma.classList.add("oculto");
        grupoCredencial.classList.add("oculto");
        grupoPlan.classList.add("oculto");
        grupoComoConocio.classList.add("oculto");
        grupoDescripcionEstudios.classList.add("oculto");
        mensajeExitoDiv.classList.add("oculto");
    });




    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar envío por defecto
        
        let formularioValido = true;
        let primerElementoInvalido = null;

        // Función auxiliar para aplicar estados visuales y textos de error
        function validarCampo(elemento, condicion, mensajeError) {
            // Saltarse la validación visual si el campo está oculto estructuralmente dentro de su grupo
            if (elemento.parentElement.classList.contains("oculto")) {
                elemento.classList.remove("campo-error", "campo-ok");
                return true;
            }

            const errorContainer = elemento.parentElement.querySelector(".error-container");
            
            if (condicion) {
                elemento.classList.remove("campo-error");
                elemento.classList.add("campo-ok");
                if (errorContainer) errorContainer.innerHTML = "";
                return true;
            } else {
                elemento.classList.remove("campo-ok");
                elemento.classList.add("campo-error");
                if (errorContainer) {
                    errorContainer.innerHTML = `<span class="mensaje-error">${mensajeError}</span>`;
                }
                if (formularioValido) {
                    primerElementoInvalido = elemento;
                    formularioValido = false;
                }
                return false;
            }
        }

        // --- SECCIÓN 1: Datos del Paciente ---
        const nombre = document.getElementById("nombre");
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
        validarCampo(nombre, nombre.value.trim() !== "" && regexLetras.test(nombre.value), "El nombre es obligatorio y sólo debe contener letras.");

        const apellido = document.getElementById("apellido");
        validarCampo(apellido, apellido.value.trim() !== "" && regexLetras.test(apellido.value), "El apellido es obligatorio y sólo debe contener letras.");

        const dni = document.getElementById("dni");
        const regexDni = /^\d{7,8}$/;
        validarCampo(dni, regexDni.test(dni.value.trim()), "El DNI es obligatorio y debe tener entre 7 y 8 dígitos numéricos.");

        const email = document.getElementById("email");
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validarCampo(email, regexEmail.test(email.value.trim()), "Ingrese un correo electrónico válido.");

        const telefono = document.getElementById("telefono");
        const regexTel = /^[0-9+\s\-]{8,}$/; 
        validarCampo(telefono, regexTel.test(telefono.value.trim()), "El teléfono es obligatorio (mínimo 8 dígitos, permite +, - o espacios).");

        // Validación fecha de nacimiento (Edad entre 0 y 120 años, no futura)
        const fechaNac = document.getElementById("fecha-nacimiento");
        let fechaNacValida = false;
        if (fechaNac.value) {
            const fechaNacDate = new Date(fechaNac.value + "T00:00:00");
            const hoy = new Date();
            hoy.setHours(0,0,0,0);
            
            let edad = hoy.getFullYear() - fechaNacDate.getFullYear();
            const diferenciaMeses = hoy.getMonth() - fechaNacDate.getMonth();
            if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacDate.getDate())) {
                edad--;
            }
            if (fechaNacDate <= hoy && edad >= 0 && edad <= 120) {
                fechaNacValida = true;
            }
        }
        validarCampo(fechaNac, fechaNacValida, "Fecha inválida. No puede ser futura y la edad máxima permitida es 120 años.");

        const genero = document.getElementById("genero");
        validarCampo(genero, genero.value !== "", "Seleccione un género.");


        // --- SECCIÓN 2: Datos del Turno ---
        const especialidad = document.getElementById("especialidad");
        validarCampo(especialidad, especialidad.value !== "", "Seleccione una especialidad.");

        const medico = document.getElementById("medico");
        validarCampo(medico, medico.disabled || medico.value !== "", "Seleccione un médico disponible.");

        const tipoConsulta = document.getElementById("tipo-consulta");
        validarCampo(tipoConsulta, tipoConsulta.value !== "", "Seleccione el tipo de consulta.");

        // Validación Fecha del turno (No pasada, mín 24 horas de anticipación, Lunes a Viernes)
        const fechaTurno = document.getElementById("fecha-turno");
        const horaTurno = document.getElementById("hora-turno");
        let fechaTurnoValida = false;
        let msgFecha = "La fecha del turno es obligatoria.";

        if (fechaTurno.value && horaTurno.value) {
            const combinacionTurno = new Date(`${fechaTurno.value}T${horaTurno.value}`);
            const ahora = new Date();
            const unDiaDespues = new Date(ahora.getTime() + (24 * 60 * 60 * 1000));
            const diaSemana = combinacionTurno.getDay(); // 0 = Domingo, 6 = Sábado

            if (combinacionTurno < ahora) {
                msgFecha = "No se permiten fechas u horarios pasados.";
            } else if (combinacionTurno < unDiaDespues) {
                msgFecha = "El turno debe solicitarse con al menos 24 horas de anticipación.";
            } else if (diaSemana === 0 || diaSemana === 6) {
                msgFecha = "Los turnos se agendan únicamente de lunes a viernes.";
            } else {
                fechaTurnoValida = true;
            }
        }
        validarCampo(fechaTurno, fechaTurnoValida, msgFecha);

        // Validación Hora del Turno (08:00 a 20:00)
        let horaValida = false;
        if (horaTurno.value) {
            const [hora, minutos] = horaTurno.value.split(":").map(Number);
            if (hora >= 8 && hora < 20) {
                horaValida = true;
            } else if (hora === 20 && minutos === 0) {
                horaValida = true;
            }
        }
        validarCampo(horaTurno, horaValida, "El horario de atención es de 08:00 a 20:00.");

        const modalidad = document.getElementById("modalidad");
        validarCampo(modalidad, modalidad.value !== "", "Seleccione la modalidad del turno.");

        const plataforma = document.getElementById("plataforma");
        validarCampo(plataforma, plataforma.value !== "", "Seleccione la plataforma para la videoconsulta.");


        // --- SECCIÓN 3: Cobertura Médica ---
        const cobertura = document.getElementById("cobertura");
        validarCampo(cobertura, cobertura.value !== "", "Seleccione su cobertura médica.");

        const credencial = document.getElementById("credencial");
        const regexCredencial = /^[a-zA-Z0-9]{5,}$/;
        validarCampo(credencial, regexCredencial.test(credencial.value.trim()), "La credencial es requerida y debe tener al menos 5 caracteres alfanuméricos.");

        const plan = document.getElementById("plan");
        validarCampo(plan, plan.value.trim() !== "", "Especifique el plan de su cobertura.");


        // --- SECCIÓN 4: Información Adicional ---
        const comoConocio = document.getElementById("como-conocio");
        validarCampo(comoConocio, comoConocio.value !== "", "Seleccione una opción de cómo nos conoció.");

        const motivo = document.getElementById("motivo");
        validarCampo(motivo, motivo.value.trim().length >= 20, "El motivo de consulta es obligatorio (mínimo 20 caracteres).");

        const descripcionEstudios = document.getElementById("descripcion-estudios");
        validarCampo(descripcionEstudios, descripcionEstudios.value.trim().length >= 20, "La descripción de estudios es obligatoria (mínimo 20 caracteres).");


      
        if (!formularioValido) {
            // Desplazarse de forma suave al primer error detectado
            if (primerElementoInvalido) {
                primerElementoInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
                primerElementoInvalido.focus();
            }
            mensajeExitoDiv.classList.add("oculto");
        } else {
            // Generar número de turno aleatorio formateado (TURN-XXXXX)
            const numAleatorio = Math.floor(10000 + Math.random() * 90000); // 5 dígitos seguros
            const codigoTurno = `TURN-${numAleatorio}`;

            // Obtener el texto visible del médico y especialidad seleccionada
            const textoEspecialidad = especialidad.options[especialidad.selectedIndex].text;
            const textoMedico = medico.options[medico.selectedIndex].text;

            // Mostrar recuadro con resumen de confirmación
            mensajeExitoDiv.innerHTML = `
                <h2>🎉 ¡Turno Solicitado Exitosamente!</h2>
                <p>Estimado/a <strong>${nombre.value} ${apellido.value}</strong>, su solicitud ha sido procesada con los siguientes datos:</p>
                <ul>
                    <li><strong>Código de Turno:</strong> ${codigoTurno}</li>
                    <li><strong>Especialidad:</strong> ${textoEspecialidad}</li>
                    <li><strong>Médico:</strong> ${textoMedico}</li>
                    <li><strong>Fecha:</strong> ${fechaTurno.value}</li>
                    <li><strong>Hora:</strong> ${horaTurno.value} hs.</li>
                </ul>
                <p style="margin-top:10px; font-size:0.9rem;">Por favor, conserve el código ante cualquier consulta administrativa.</p>
            `;
            mensajeExitoDiv.classList.remove("oculto");
            
            // Hacer scroll hasta el mensaje de confirmación
            mensajeExitoDiv.scrollIntoView({ behavior: "smooth" });
            
            // Opcional: limpiar el formulario para nuevas solicitudes
            form.reset();
        }
    });
});