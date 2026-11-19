/*
 * academic-export.js
 * Exportadores académicos del Generador de Iceberg Pro.
 *
 * Este módulo no depende del DOM. Recibe un objeto "icebergData" y produce:
 *   - Un documento HTML académico, pensado para imprimirse como PDF.
 *   - Un documento DOCX real, mediante la librería docx.
 *
 * La app interactiva sigue siendo la vista de trabajo; este módulo es el que
 * convierte el contenido en un material formativo citable y entregable.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.AcademicExport = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VERSION = "1.0.0";

  /* ------------------------------------------------------------------ */
  /* Utilidades de texto                                                 */
  /* ------------------------------------------------------------------ */

  function text(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
    if (typeof value === "object") return Object.values(value).map(text).filter(Boolean).join(" · ");
    return String(value);
  }

  function escapeHtml(value) {
    return text(value).replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
    });
  }

  function trimDot(value) {
    return text(value).replace(/[\s.]+$/g, "").trim();
  }

  function yearOf(reference) {
    const year = text(reference && reference.year).trim();
    return /^\d{4}$/.test(year) ? year : "s. f.";
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.filter(function (item) { return item !== null && item !== undefined; });
    if (value && typeof value === "object") return Object.values(value);
    return value ? [value] : [];
  }

  function normalizeKey(value) {
    return text(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  /**
   * Abreviatura razonable para una cita en el texto.
   * No sustituye a un formateador APA completo: evita que la cita muestre
   * "Benoit Mandelbrot, 1982" cuando debe mostrar "Mandelbrot, 1982".
   */
  function authorShort(author) {
    const raw = text(author).replace(/\s+/g, " ").trim();
    if (!raw) return "Autor";
    if (/\b(Universidad|Organizaci[oó]n|Ministerio|Instituto|Centro|Fundaci[oó]n|UNESCO|OCDE|OMS|INTEF|UNAM|ISO|AWS|Wikipedia|Frontiers|Ciencia Latina|ScienceDirect|MERLOT|Dialnet|Educators? Technology|Red Descartes)\b/i.test(raw)) {
      return raw;
    }
    const first = raw.split(/\s*(?:;|\by\b|\band\b|&)\s*/).filter(Boolean)[0] || raw;
    if (first.includes(",")) return first.split(",")[0].trim();
    const tokens = first.split(/\s+/).filter(Boolean);
    return tokens[tokens.length - 1] || first;
  }

  function inTextCitation(reference) {
    const short = text(reference && reference.shortAuthor).trim() || authorShort(reference && reference.author);
    return "(" + short + ", " + yearOf(reference) + ")";
  }

  function apaParts(reference) {
    const ref = reference || {};
    return {
      author: trimDot(ref.author) || "Autor desconocido",
      year: yearOf(ref),
      title: trimDot(ref.title) || "Sin título",
      url: text(ref.url).trim()
    };
  }

  function formatApaHtml(reference) {
    const parts = apaParts(reference);
    const link = parts.url
      ? ' <a href="' + escapeHtml(parts.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(parts.url) + "</a>"
      : "";
    return escapeHtml(parts.author) + ". (" + parts.year + "). <em>" + escapeHtml(parts.title) + "</em>." + link;
  }

  function formatApaText(reference) {
    const parts = apaParts(reference);
    return parts.author + ". (" + parts.year + "). " + parts.title + "." + (parts.url ? " " + parts.url : "");
  }

  function dedupeReferences(list) {
    const output = [];
    asArray(list).forEach(function (reference) {
      if (!reference || typeof reference !== "object") return;
      const url = text(reference.url).trim();
      if (!url) return;
      if (output.some(function (item) { return text(item.url).trim() === url; })) return;
      output.push(reference);
    });
    return output;
  }

  function sortReferences(list) {
    return dedupeReferences(list).slice().sort(function (a, b) {
      return normalizeKey(a.author).localeCompare(normalizeKey(b.author), "es") ||
        yearOf(a).localeCompare(yearOf(b)) ||
        normalizeKey(a.title).localeCompare(normalizeKey(b.title), "es");
    });
  }

  function splitParagraphs(value) {
    return text(value)
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n|\n/)
      .map(function (line) { return line.trim(); })
      .filter(Boolean);
  }

  function paragraphsHtml(value, className) {
    const cls = className ? ' class="' + className + '"' : "";
    return splitParagraphs(value).map(function (line) {
      return "<p" + cls + ">" + escapeHtml(line) + "</p>";
    }).join("");
  }

  function listHtml(items, ordered) {
    const list = asArray(items);
    if (!list.length) return '<p class="muted">Sin elementos registrados.</p>';
    const tag = ordered ? "ol" : "ul";
    return "<" + tag + ">" + list.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("") + "</" + tag + ">";
  }

  function conceptsHtml(value) {
    const list = asArray(value);
    if (!list.length) return '<p class="muted">Sin conceptos registrados.</p>';
    return "<ul>" + list.map(function (item) {
      if (!item || typeof item !== "object") return "<li>" + escapeHtml(item) + "</li>";
      const term = item.term || item.concept || item.name || item.key || "";
      const meaning = item.meaning || item.definition || item.explanation || item.description || "";
      const relations = item.relations || item.relation || item.relationship || item.connections || "";
      return "<li><strong>" + escapeHtml(term) + "</strong>" +
        (meaning ? ": " + escapeHtml(meaning) : "") +
        (relations ? " <em>Relación: " + escapeHtml(relations) + "</em>" : "") +
        "</li>";
    }).join("") + "</ul>";
  }

  function stripOptionLabel(value) {
    let result = text(value).replace(/\s+/g, " ").trim();
    // El modelo a veces devuelve "A) ...", "A. ..." o "A.D) ..."; el documento
    // ya añade su propia letra, así que se retiran hasta dos etiquetas iniciales.
    for (let i = 0; i < 2; i++) {
      const next = result.replace(/^[A-Ha-h]\s*[\.\)\:\-·]\s*/, "").trim();
      if (!next || next === result) break;
      result = next;
    }
    return result;
  }

  function quizQuestions(value) {
    return asArray(value).map(function (question) {
      if (!question || typeof question !== "object") return null;
      const options = asArray(question.options).map(text).map(stripOptionLabel);
      const answer = Number(question.answer);
      if (!question.q || options.length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length) return null;
      return {
        q: text(question.q),
        options: options,
        answer: answer,
        why: text(question.why)
      };
    }).filter(Boolean);
  }

  function optionLetter(index) {
    return "ABCDEFGH"[index] || String(index + 1);
  }

  function quizBodyHtml(questions) {
    const list = quizQuestions(questions);
    if (!list.length) return '<p class="muted">Sin preguntas registradas.</p>';
    return '<ol class="quiz">' + list.map(function (question) {
      return '<li><p class="quiz-q">' + escapeHtml(question.q) + "</p><ol class=\"quiz-options\" type=\"A\">" +
        question.options.map(function (option) {
          return "<li>" + escapeHtml(option) + "</li>";
        }).join("") + "</ol></li>";
    }).join("") + "</ol>";
  }

  function quizKeyHtml(questions) {
    const list = quizQuestions(questions);
    if (!list.length) return '<p class="muted">Sin preguntas registradas.</p>';
    return '<ol class="answer-key">' + list.map(function (question) {
      const letter = optionLetter(question.answer);
      const correct = question.options[question.answer] || "";
      return "<li><strong>" + letter + ".</strong> " + escapeHtml(correct) +
        (question.why ? " — " + escapeHtml(question.why) : "") + "</li>";
    }).join("") + "</ol>";
  }

  /* ------------------------------------------------------------------ */
  /* Imágenes                                                            */
  /* ------------------------------------------------------------------ */

  function dataUrlInfo(url) {
    const match = /^data:image\/(png|jpe?g|gif|bmp);base64,([a-z0-9+/=\s]+)$/i.exec(text(url).trim());
    if (!match) return null;
    const mime = match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase();
    const base64 = match[2].replace(/\s+/g, "");
    return { mime: mime, base64: base64 };
  }

  function base64Bytes(base64) {
    try {
      if (typeof atob === "function") {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
      }
      if (typeof Buffer !== "undefined") return Buffer.from(base64, "base64");
    } catch (error) {
      return null;
    }
    return null;
  }

  function imageDimensions(dataUrl) {
    const info = dataUrlInfo(dataUrl);
    if (!info) return null;
    const bytes = base64Bytes(info.base64);
    if (!bytes || bytes.length < 24) return null;

    if (info.mime === "png" && bytes[0] === 0x89 && bytes[1] === 0x50) {
      const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
      const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
      if (width > 0 && height > 0) return { width: width, height: height };
    }

    if (info.mime === "jpg" && bytes[0] === 0xff && bytes[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < bytes.length) {
        if (bytes[offset] !== 0xff) { offset++; continue; }
        const marker = bytes[offset + 1];
        const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          const height = (bytes[offset + 5] << 8) | bytes[offset + 6];
          const width = (bytes[offset + 7] << 8) | bytes[offset + 8];
          if (width > 0 && height > 0) return { width: width, height: height };
        }
        offset += 2 + length;
      }
    }

    return null;
  }

  function scaledImageSize(dataUrl, maxWidth, maxHeight) {
    const dimensions = imageDimensions(dataUrl);
    const maxW = maxWidth || 520;
    const maxH = maxHeight || 360;
    if (!dimensions) return { width: maxW, height: Math.round(maxW * 0.67) };
    const scale = Math.min(maxW / dimensions.width, maxH / dimensions.height, 1);
    return {
      width: Math.max(1, Math.round(dimensions.width * scale)),
      height: Math.max(1, Math.round(dimensions.height * scale))
    };
  }

  function imageUrlFor(entry) {
    return text(entry && (entry.imageDataUrl || entry.imageUrl)).trim();
  }

  function imageFigureHtml(entry, index) {
    const url = imageUrlFor(entry);
    if (!url || !/^data:image\//i.test(url)) {
      return '<div class="figure-placeholder"><span>Imagen no disponible para el documento académico.</span></div>';
    }
    const alt = text(entry.imageAlt) || ("Imagen de la entrada " + text(entry.title));
    const credit = text(entry.imageCredit) || "Imagen generada con IA para esta entrada.";
    const size = scaledImageSize(url, 520, 340);
    // Word no apila bien <figure>/<figcaption>: el pie se coloca al lado de la
    // imagen. Una tabla de una columna fuerza imagen arriba y pie debajo.
    return '<table class="entry-figure" role="presentation"><tbody>' +
      '<tr><td class="figure-image"><img src="' + escapeHtml(url) + '" alt="' + escapeHtml(alt) +
      '" width="' + size.width + '" height="' + size.height + '"></td></tr>' +
      '<tr><td class="figure-caption">' + escapeHtml(credit) + '</td></tr>' +
      '</tbody></table>';
  }

  /* ------------------------------------------------------------------ */
  /* HTML académico                                                      */
  /* ------------------------------------------------------------------ */

  function metadataRows(metadata) {
    const md = metadata || {};
    return [
      ["Autoría", md.author || "Por definir"],
      ["Institución", md.institution || "Por definir"],
      ["Área o curso", md.course || "Por definir"],
      ["Fecha", md.date || new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })],
      ["Versión", md.version || "1.0"],
      ["Licencia", md.license || "Uso educativo; indicar la licencia antes de publicar."],
      ["Idioma", md.language || "Español"]
    ];
  }

  function buildHtml(data, options) {
    const opts = options || {};
    const md = (data && data.metadata) || {};
    const plan = (data && data.plan) || {};
    const levels = asArray(data && data.levels);
    const finalQuiz = asArray(data && data.finalQuiz);
    const references = (data && data.references) || {};
    const title = md.title || "Iceberg educativo";
    const subtitle = md.subtitle || "Material para formar pensamiento crítico";
    const coverDate = md.date || new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    const cited = sortReferences(references.cited || []);
    const consulted = sortReferences(references.consulted || []);

    const toc = levels.map(function (level, levelIndex) {
      const entries = asArray(level.entries).map(function (entry, entryIndex) {
        return '<li><a href="#entrada-' + (levelIndex + 1) + "-" + (entryIndex + 1) + '">' + escapeHtml(entry.title) + "</a></li>";
      }).join("");
      return '<li><a href="#nivel-' + (levelIndex + 1) + '">' + escapeHtml(level.name || ("Nivel " + (levelIndex + 1))) + "</a><ol>" + entries + "</ol></li>";
    }).join("");

    const levelsHtml = levels.map(function (level, levelIndex) {
      const entries = asArray(level.entries).map(function (entry, entryIndex) {
        const hasCitations = asArray(entry.citedReferences).length > 0;
        return '<article class="entry" id="entrada-' + (levelIndex + 1) + "-" + (entryIndex + 1) + '">' +
          '<h3>' + escapeHtml(entry.title) + "</h3>" +
          imageFigureHtml(entry, entryIndex) +
          (!hasCitations ? '<p class="citation-warning">Esta entrada no registra citas verificables en el texto. Antes de publicarla, revisa las fuentes y añade la cita que corresponda a cada afirmación.</p>' : "") +
          '<div class="entry-body">' + paragraphsHtml(entry.explanation, "lead") + "</div>" +
          '<section class="block"><h4>Conceptos clave y relaciones</h4>' + conceptsHtml(entry.keyConcepts) + "</section>" +
          '<section class="block"><h4>Pensamiento crítico y evidencias</h4>' + paragraphsHtml(entry.evidenceQuestion) + "</section>" +
          '<section class="block"><h4>Preguntas socráticas</h4>' + listHtml(entry.socraticQuestions, true) + "</section>" +
          '<section class="block"><h4>Actividad de aprendizaje</h4>' + paragraphsHtml(entry.activity) + "</section>" +
          '<section class="block"><h4>Transferencia</h4>' + paragraphsHtml(entry.transfer) + "</section>" +
          '<section class="block"><h4>Evaluación formativa</h4>' +
          "<p><strong>" + escapeHtml(entry.checkQuestion) + "</strong></p>" +
          '<p class="feedback">' + escapeHtml(entry.feedback) + "</p>" +
          (asArray(entry.quiz).length ? '<div class="entry-quiz">' + quizBodyHtml(entry.quiz) + "</div>" : "") +
          "</section></article>";
      }).join("");

      return '<section class="level" id="nivel-' + (levelIndex + 1) + '">' +
        '<p class="level-kicker">Nivel ' + (levelIndex + 1) + "</p>" +
        "<h2>" + escapeHtml(level.name || ("Nivel " + (levelIndex + 1))) + "</h2>" +
        (level.cognitiveFocus ? '<p class="level-focus"><strong>Enfoque cognitivo:</strong> ' + escapeHtml(level.cognitiveFocus) + (level.cognitiveDescription ? '. ' + escapeHtml(level.cognitiveDescription) : '') + "</p>" : "") +
        (level.introduction ? '<div class="level-intro">' + paragraphsHtml(level.introduction) + "</div>" : "") +
        (asArray(level.citedReferences).length ? "" : '<p class="citation-warning">La introducción de este nivel no registra citas verificables. Revisa las fuentes antes de publicar el material.</p>') +
        entries + "</section>";
    }).join("");

    const referencesHtml = cited.length
      ? '<ol class="references">' + cited.map(function (reference) {
        return "<li>" + formatApaHtml(reference) + "</li>";
      }).join("") + "</ol>"
      : '<p class="muted">No se registraron referencias citadas en el texto. Si el material se va a publicar, revisa las fuentes antes de distribuirlo.</p>';

    const consultedHtml = consulted.length
      ? '<ol class="references consulted">' + consulted.map(function (reference) {
        return "<li>" + formatApaHtml(reference) + "</li>";
      }).join("") + "</ol>"
      : '<p class="muted">No se registraron fuentes consultadas.</p>';
    const metadataHtml = metadataRows(md).map(function (row) {
      return "<tr><th>" + escapeHtml(row[0]) + "</th><td>" + escapeHtml(row[1]) + "</td></tr>";
    }).join("");

    const imageCredits = [];
    levels.forEach(function (level) {
      asArray(level.entries).forEach(function (entry) {
        if (imageUrlFor(entry)) {
          imageCredits.push("<li><strong>" + escapeHtml(entry.title) + "</strong>: " + escapeHtml(text(entry.imageCredit) || "Imagen generada con IA para esta entrada.") + "</li>");
        }
      });
    });

    const objectives = asArray(plan.objectives);
    const priorKnowledge = asArray(plan.priorKnowledge);
    const metacognition = asArray(plan.metacognition);

    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      "<title>" + escapeHtml(title) + "</title>\n" +
      '<script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"],["$","$"]],displayMath:[["\\\\[","\\\\]"],["$$","$$"]]}};<\/script>\n' +
      '<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"><\/script>\n' +
      '<script>(function(){function s(){document.querySelectorAll("mjx-merror").forEach(function(e){var w=e.closest("mjx-container");if(!w)return;w.setAttribute("title",e.getAttribute("data-mjx-error")||"Fórmula no válida");w.innerHTML=\'<span style="display:inline-block;background:#fff7ed;color:#8a4b08;border:1px solid #d97706;border-radius:4px;padding:0 5px;font:700 .82em system-ui,sans-serif">⚠ fórmula no válida</span>\';});}var n=0;var t=setInterval(function(){if(document.querySelector("mjx-merror")){s();clearInterval(t);}else if(++n>20){clearInterval(t);}},500);})();<\/script>\n' +
      "<style>\n" + academicCss() + "\n</style>\n</head>\n<body>\n" +
      '<div class="no-print toolbar"><button type="button" onclick="window.print()">Imprimir o guardar como PDF</button>' +
      '<button type="button" onclick="window.close()">Cerrar</button>' +
      '<span class="toolbar-note">Para obtener el PDF, pulsa “Imprimir o guardar como PDF” y elige “Guardar como PDF”.</span></div>\n' +
      '<main class="document">\n' +
      '<section class="cover">' +
      '<p class="kicker">Material educativo · Pensamiento crítico</p>' +
      "<h1>" + escapeHtml(title) + "</h1>" +
      '<p class="subtitle">' + escapeHtml(subtitle) + "</p>" +
      '<div class="cover-meta">' +
      "<p><strong>Autoría:</strong> " + escapeHtml(md.author || "Por definir") + "</p>" +
      "<p><strong>Institución:</strong> " + escapeHtml(md.institution || "Por definir") + "</p>" +
      "<p><strong>Área o curso:</strong> " + escapeHtml(md.course || "Por definir") + "</p>" +
      "<p><strong>Fecha:</strong> " + escapeHtml(coverDate) + "</p>" +
      "<p><strong>Versión:</strong> " + escapeHtml(md.version || "1.0") + "</p>" +
      "</div>" +
      '<p class="cover-note">Documento elaborado con apoyo de inteligencia artificial y revisión humana. Las citas y referencias deben verificarse antes de su publicación. La selección de fuentes y la interpretación pedagógica son responsabilidad de la autoría.</p>' +
      "</section>\n" +
      '<section class="front-matter">' +
      '<h2 class="unnumbered">Ficha pedagógica</h2>' +
      '<table class="metadata"><tbody>' + metadataHtml + "</tbody></table>" +
      '<table class="two-col"><tr><td><h3>Propósito</h3><p>Este material organiza el tema <strong>' + escapeHtml(title) + "</strong> en " + levels.length + " niveles de profundidad creciente. Cada nivel combina explicación conceptual, preguntas socráticas, análisis de evidencias, actividad y evaluación formativa para que el estudiante no solo recuerde información, sino que aprenda a interrogarla, contextualizarla y argumentar.</p></td>" +
      '<td><h3>Uso sugerido</h3><p>Puede utilizarse en educación superior o en formación docente. Se recomienda trabajarlo en dos o tres sesiones: activación de conocimientos previos, recorrido por niveles con discusión guiada y cierre metacognitivo con el cuestionario final.</p></td></tr></table>' +
      '<h3>Objetivos de aprendizaje</h3>' + listHtml(objectives) +
      '<h3>Activación de conocimientos previos</h3>' + listHtml(priorKnowledge, true) +
      '<h3>Metodología y evaluación</h3>' +
      "<p>Se propone una metodología de indagación guiada: el estudiante lee, formula preguntas, distingue hechos de interpretaciones, contrasta fuentes y construye una conclusión revisable. La evaluación es formativa y continua; el cuestionario final y la rúbrica del anexo permiten valorar la comprensión y la calidad del razonamiento.</p>" +
      "</section>\n" +
      '<section class="toc"><h2 class="unnumbered">Índice</h2><ol>' + toc + "</ol></section>\n" +
      levelsHtml + "\n" +
      '<section class="final-quiz"><h2>Cuestionario final</h2><p>Responde sin consultar las respuestas. Al final del documento encontrarás la clave con la explicación de cada opción correcta.</p>' + quizBodyHtml(finalQuiz) + "</section>\n" +
      '<section class="metacognition"><h2>Cierre metacognitivo</h2><p>Reflexiona sobre tu recorrido de aprendizaje:</p>' + listHtml(metacognition, true) + "</section>\n" +
      '<section class="references-section"><h2>Referencias citadas</h2><p>Se incluyen únicamente las fuentes que sostienen afirmaciones del texto. Si una entrada no tiene citas, se advierte en su lugar.</p>' + referencesHtml + "</section>\n" +
      '<section class="annex"><h2>Anexo 1. Clave de respuestas</h2><p>Clave del cuestionario final y de las preguntas de cada entrada.</p>' +
      '<h3>Cuestionario final</h3>' + quizKeyHtml(finalQuiz) +
      levels.map(function (level, index) {
        const entryKeys = asArray(level.entries).map(function (entry) {
          return asArray(entry.quiz).length ? "<h4>" + escapeHtml(entry.title) + "</h4>" + quizKeyHtml(entry.quiz) : "";
        }).filter(Boolean).join("");
        return entryKeys ? "<h3>Nivel " + (index + 1) + ": " + escapeHtml(level.name) + "</h3>" + entryKeys : "";
      }).join("") +
      "</section>\n" +
      '<section class="annex"><h2>Anexo 2. Rúbrica de evaluación</h2>' + rubricHtml() + "</section>\n" +
      '<section class="annex"><h2>Anexo 3. Guía docente</h2>' + teacherGuideHtml() + "</section>\n" +
      '<section class="annex"><h2>Anexo 4. Fuentes consultadas</h2><p>Esta lista recoge las fuentes que el modelo declaró haber consultado. No todas se citan en el texto; la sección de referencias citadas es la que sostiene las afirmaciones.</p>' + consultedHtml + "</section>\n" +
      '<section class="annex"><h2>Anexo 5. Créditos de imágenes</h2>' + (imageCredits.length ? "<ul>" + imageCredits.join("") + "</ul>" : '<p class="muted">No se registraron imágenes.</p>') + "</section>\n" +
      '<footer class="document-footer"><p>' + escapeHtml(title) + " · " + escapeHtml(md.author || "Por definir") + " · " + escapeHtml(coverDate) + "</p><p>Documento generado con el Generador de Iceberg Pro. Verifica las fuentes antes de publicar.</p></footer>\n" +
      "</main>\n</body>\n</html>";
  }

  function academicCss() {
    return [
      ":root{--ink:#1f2937;--muted:#5b6573;--accent:#1f3864;--line:#cbd5e1;--soft:#f8fafc;--warn:#8a4b08;--warn-bg:#fff7ed}",
      "*{box-sizing:border-box}",
      "html{background:#e5e7eb}",
      "body{margin:0;background:#e5e7eb;color:var(--ink);font-family:Georgia,'Times New Roman',serif;font-size:11.5pt;line-height:1.6}",
      ".document{max-width:860px;margin:0 auto;background:#fff;padding:38px 54px 60px;box-shadow:0 10px 30px rgba(0,0,0,.08)}",
      ".toolbar{position:sticky;top:0;z-index:10;display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;padding:12px;background:#0f172a}",
      ".toolbar button{border:0;border-radius:999px;padding:10px 18px;background:#2563eb;color:#fff;font:600 14px system-ui,sans-serif;cursor:pointer}",
      ".toolbar button+button{background:#334155}",
      ".toolbar-note{font-family:system-ui,sans-serif;font-size:9pt;color:#cbd5e1;flex-basis:100%;text-align:center}",
      ".cover{min-height:76vh;display:flex;flex-direction:column;justify-content:center;border-bottom:1px solid var(--line);padding-bottom:26px;margin-bottom:26px}",
      ".kicker{font-family:system-ui,sans-serif;font-size:10pt;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 14px}",
      "h1{font-size:30pt;line-height:1.15;margin:0 0 12px;color:var(--accent);letter-spacing:-.02em}",
      ".subtitle{font-size:14pt;color:var(--muted);margin:0 0 18px;font-style:italic}",
      ".cover-meta{font-family:system-ui,sans-serif;font-size:10.5pt;line-height:1.45;border-left:4px solid var(--accent);padding-left:18px}",
      ".cover-meta p{margin:0}",
      ".cover-note{font-family:system-ui,sans-serif;font-size:9pt;color:var(--muted);margin-top:18px;max-width:620px}",
      "h2{font-family:system-ui,'Segoe UI',sans-serif;font-size:18pt;color:var(--accent);margin:28px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--line);page-break-after:avoid}",
      "h2.unnumbered{font-size:16pt}",
      "h3{font-family:system-ui,'Segoe UI',sans-serif;font-size:13.5pt;color:#0f172a;margin:18px 0 7px;page-break-after:avoid}",
      "h4{font-family:system-ui,'Segoe UI',sans-serif;font-size:10.5pt;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);margin:18px 0 6px;page-break-after:avoid}",
      "p{margin:0 0 10px}",
      "ul,ol{margin:0 0 14px 22px;padding:0}",
      "li{margin:0 0 6px}",
      ".lead{font-size:12pt}",
      ".front-matter{line-height:1.35}",
      ".front-matter p{margin:0 0 6px}",
      ".front-matter ul,.front-matter ol{margin:0 0 8px 22px}",
      ".front-matter li{margin:0 0 3px}",
      ".front-matter h3{margin:12px 0 5px}",
      ".front-matter .metadata{margin:5px 0 10px}",
      ".grid-two{display:grid;grid-template-columns:1fr 1fr;gap:24px}",
      ".two-col{width:100%;border-collapse:collapse;table-layout:fixed;margin:4px 0 10px}",
      ".two-col td{width:50%;vertical-align:top;padding:0 12px 0 0}",
      ".two-col td+td{padding:0 0 0 12px}",
      ".metadata{width:100%;border-collapse:collapse;font-family:system-ui,sans-serif;font-size:9pt;margin:6px 0 12px;line-height:1.25}",
      ".metadata th,.metadata td{border:1px solid var(--line);padding:4px 6px;text-align:left;vertical-align:top}",
      ".metadata th{width:28%;background:var(--soft);color:var(--accent)}",
      ".toc ol{font-family:system-ui,sans-serif;font-size:10.5pt}",
      ".toc li{margin-bottom:8px}",
      ".toc a{color:var(--ink);text-decoration:none}",
      ".toc ol ol{margin-top:6px}",
      ".level{page-break-before:always;padding-top:6px}",
      ".level-kicker{font-family:system-ui,sans-serif;font-size:9pt;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:0 0 4px}",
      ".level-intro{background:var(--soft);border-left:4px solid var(--accent);padding:14px 18px;margin:10px 0 24px}",
      ".level-focus{font-family:system-ui,sans-serif;font-size:11.6pt;font-weight:600;color:#334155;margin:0 0 12px}",
      ".entry{margin-bottom:30px;page-break-inside:auto}",
      ".entry h3{border-bottom:1px solid var(--line);padding-bottom:6px}",
      ".entry-figure{width:100%;max-width:560px;margin:16px auto 20px;border-collapse:collapse;border:0;table-layout:fixed;page-break-inside:avoid}",
      ".entry-figure td{border:0;padding:0;text-align:center;vertical-align:top}",
      ".entry-figure .figure-image img{display:block;width:auto;max-width:100%;max-height:340px;height:auto;margin:0 auto;border:1px solid var(--line);border-radius:4px}",
      ".entry-figure .figure-caption{font-family:system-ui,sans-serif;font-size:8.5pt;color:var(--muted);padding-top:6px;text-align:center}",
      ".figure-placeholder{border:1px dashed var(--line);background:var(--soft);color:var(--muted);font-family:system-ui,sans-serif;font-size:9pt;padding:18px;margin:14px 0;text-align:center}",
      ".block{border-top:1px solid var(--line);padding-top:12px;margin-top:14px}",
      ".feedback{background:var(--soft);border-left:3px solid var(--accent);padding:10px 14px;font-style:italic}",
      ".citation-warning{background:var(--warn-bg);border-left:4px solid #d97706;color:var(--warn);font-family:system-ui,sans-serif;font-size:9.5pt;padding:10px 14px;margin:12px 0}",
      "mjx-merror{background:#fff7ed;color:#8a4b08;border:1px solid #d97706;border-radius:3px;padding:0 3px;font-family:system-ui,sans-serif;font-size:.85em}",
      ".entry-quiz,.final-quiz{page-break-inside:avoid}",
      ".quiz-q{font-weight:700;margin-bottom:6px}",
      ".quiz-options{margin-bottom:12px}",
      ".answer-key li{margin-bottom:8px}",
      ".references{padding-left:2.2em;margin-left:0}",
      ".references li{margin-bottom:10px;padding-left:0;text-indent:0;font-family:system-ui,sans-serif;font-size:9.5pt;line-height:1.55}",
      ".references a{color:#1d4ed8;text-decoration:none;overflow-wrap:anywhere}",
      ".consulted{color:var(--muted)}",
      ".annex{page-break-before:always}",
      ".muted{color:var(--muted);font-family:system-ui,sans-serif;font-size:9.5pt}",
      ".rubric{width:100%;border-collapse:collapse;font-family:system-ui,sans-serif;font-size:8.8pt;margin:12px 0}",
      ".rubric th,.rubric td{border:1px solid var(--line);padding:6px 7px;vertical-align:top;text-align:left}",
      ".rubric th{background:var(--soft);color:var(--accent)}",
      ".document-footer{margin-top:50px;border-top:1px solid var(--line);padding-top:14px;font-family:system-ui,sans-serif;font-size:8.5pt;color:var(--muted);text-align:center}",
      ".document-footer p{margin:2px 0}",
      "@page{size:A4;margin:20mm 18mm 20mm}",
      "@media print{html,body{background:#fff}.document{box-shadow:none;max-width:none;padding:0}.no-print{display:none!important}.cover{min-height:auto;page-break-after:always;border-bottom:0}.level{page-break-before:always}.annex{page-break-before:always}a{color:inherit;text-decoration:none}.entry-figure{max-width:100%;margin-left:auto;margin-right:auto}.entry-figure img{max-height:85mm;max-width:100%;width:auto;margin:0 auto}}",
      "@media(max-width:720px){.document{padding:22px 18px}.grid-two{grid-template-columns:1fr}h1{font-size:24pt}.toolbar{flex-wrap:wrap}}"
    ].join("\n");
  }

  function rubricHtml() {
    return '<table class="rubric"><thead><tr><th>Criterio</th><th>Inicial</th><th>En desarrollo</th><th>Logrado</th><th>Excelente</th></tr></thead><tbody>' +
      "<tr><th>Comprensión conceptual</th><td>Reconoce algunos términos aislados.</td><td>Explica las ideas principales con apoyo.</td><td>Explica y relaciona los conceptos con precisión.</td><td>Integra los conceptos en una explicación propia y matizada.</td></tr>" +
      "<tr><th>Análisis crítico</th><td>Describe sin cuestionar.</td><td>Formula preguntas básicas.</td><td>Distingue hechos, interpretaciones e hipótesis.</td><td>Evalúa supuestos, sesgos y límites de la evidencia.</td></tr>" +
      "<tr><th>Uso de evidencias</th><td>No cita fuentes o cita sin relación.</td><td>Usa alguna fuente pertinente.</td><td>Contrasta fuentes y justifica su pertinencia.</td><td>Integra evidencias diversas y reconoce incertidumbres.</td></tr>" +
      "<tr><th>Transferencia</th><td>No conecta con otros contextos.</td><td>Establece una conexión superficial.</td><td>Relaciona el tema con un caso o problema real.</td><td>Propone una transferencia fundamentada y original.</td></tr>" +
      "<tr><th>Metacognición</th><td>No reflexiona sobre su proceso.</td><td>Identifica una dificultad.</td><td>Explica estrategias y cambios en sus ideas.</td><td>Planifica cómo seguir aprendiendo y revisar sus conclusiones.</td></tr>" +
      "</tbody></table>";
  }

  function teacherGuideHtml() {
    return '<div class="grid-two">' +
      "<div><h3>Antes de la sesión</h3><ul>" +
      "<li>Revisa las citas y la lista de referencias; verifica que las fuentes existan y sean pertinentes.</li>" +
      "<li>Adapta el lenguaje y los ejemplos al grupo. Si el tema es sensible, acuerda reglas de diálogo.</li>" +
      "<li>Activa los conocimientos previos con las preguntas de la ficha pedagógica.</li>" +
      "</ul></div>" +
      "<div><h3>Durante la sesión</h3><ul>" +
      "<li>Trabaja nivel por nivel; no reveles todas las respuestas de golpe.</li>" +
      "<li>Pide a los estudiantes que distingan hecho, interpretación, hipótesis y opinión.</li>" +
      "<li>Usa las preguntas socráticas para profundizar y las actividades para aplicar.</li>" +
      "<li>Registra las dudas que aparezcan para retomarlas en el cierre.</li>" +
      "</ul></div>" +
      "<div><h3>Después de la sesión</h3><ul>" +
      "<li>Aplica el cuestionario final y comenta la clave de respuestas.</li>" +
      "<li>Cierra con las preguntas metacognitivas y una transferencia a un caso actual.</li>" +
      "<li>Pide una revisión crítica de una de las fuentes citadas.</li>" +
      "</ul></div>" +
      "<div><h3>Evaluación</h3><ul>" +
      "<li>Usa la rúbrica del anexo para valorar comprensión, análisis, evidencias, transferencia y metacognición.</li>" +
      "<li>Prioriza la calidad del razonamiento sobre la cantidad de contenido memorizado.</li>" +
      "<li>Incluye una instancia de autoevaluación y otra de coevaluación.</li>" +
      "</ul></div></div>";
  }

  /* ------------------------------------------------------------------ */
  /* DOCX                                                                */
  /* ------------------------------------------------------------------ */

  function buildDocx(docx, data, options) {
    if (!docx || !docx.Document || !docx.Packer) throw new Error("La librería docx no está disponible.");
    const opts = options || {};
    const md = (data && data.metadata) || {};
    const plan = (data && data.plan) || {};
    const levels = asArray(data && data.levels);
    const finalQuiz = asArray(data && data.finalQuiz);
    const references = (data && data.references) || {};
    const cited = sortReferences(references.cited || []);
    const consulted = sortReferences(references.consulted || []);
    const title = md.title || "Iceberg educativo";
    const subtitle = md.subtitle || "Material para formar pensamiento crítico";
    const date = md.date || new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

    const {
      Document, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun,
      Table, TableRow, TableCell, WidthType, PageBreak, Header, Footer,
      PageNumber, TableOfContents, BorderStyle, ShadingType, VerticalAlign,
      LevelFormat, convertInchesToTwip
    } = docx;

    const FONT = "Calibri";
    const ACCENT = "1F3864";

    function run(value, options) {
      const o = options || {};
      return new TextRun({
        text: text(value),
        font: o.font || FONT,
        size: o.size || 22,
        bold: !!o.bold,
        italics: !!o.italics,
        color: o.color || "1F2937",
        allCaps: !!o.allCaps
      });
    }

    function paragraph(value, options) {
      const o = options || {};
      const runOptions = o.run || {};
      return new Paragraph({
        alignment: o.alignment,
        spacing: o.spacing || { after: 120, line: 276 },
        pageBreakBefore: !!o.pageBreakBefore,
        heading: o.heading,
        border: o.border,
        shading: o.shading,
        indent: o.indent,
        bullet: o.bullet,
        numbering: o.numbering,
        children: Array.isArray(o.children) ? o.children : [run(value, Object.assign({}, o, runOptions))]
      });
    }

    function heading(value, level, options) {
      const o = options || {};
      return new Paragraph({
        heading: level,
        spacing: o.spacing || { before: 320, after: 140 },
        pageBreakBefore: !!o.pageBreakBefore,
        children: [run(value, { bold: true, size: o.size || (level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 26 : 23), color: ACCENT })]
      });
    }

    function bullet(value) {
      return new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 70, line: 264 },
        children: [run(value, { size: 21 })]
      });
    }

    function numbered(value) {
      return new Paragraph({
        numbering: { reference: "iceberg-numbering", level: 0 },
        spacing: { after: 80, line: 264 },
        children: [run(value, { size: 21 })]
      });
    }

    function labelParagraph(label, value) {
      return new Paragraph({
        spacing: { after: 100, line: 264 },
        children: [
          run(label + ": ", { bold: true, size: 21, color: ACCENT }),
          run(value, { size: 21 })
        ]
      });
    }

    function imageParagraph(entry) {
      const url = imageUrlFor(entry);
      if (!url || !/^data:image\//i.test(url)) return [];
      const info = dataUrlInfo(url);
      if (!info) return [];
      const dimensions = scaledImageSize(url, 480, 320);
      try {
        return [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 80 },
            children: [
              new ImageRun({
                type: info.mime === "jpg" ? "jpg" : info.mime,
                data: url,
                transformation: dimensions,
                altText: {
                  title: text(entry.title),
                  description: text(entry.imageAlt) || ("Imagen de la entrada " + text(entry.title)),
                  name: text(entry.title)
                }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [run(text(entry.imageCredit) || "Imagen generada con IA para esta entrada.", { size: 16, italics: true, color: "5B6573" })]
          })
        ];
      } catch (error) {
        return [paragraph("Imagen no disponible en este documento.", { run: { italics: true, color: "5B6573" } })];
      }
    }

    function dataTable(rows, widths) {
      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.map(function (row, rowIndex) {
          return new TableRow({
            children: row.map(function (cell, cellIndex) {
              return new TableCell({
                width: widths && widths[cellIndex] ? { size: widths[cellIndex], type: WidthType.PERCENTAGE } : undefined,
                shading: rowIndex === 0 ? { fill: "F2F5F9", type: ShadingType.CLEAR, color: "auto" } : undefined,
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({
                  spacing: { after: 40, line: 252 },
                  children: [run(cell, { size: 18, bold: rowIndex === 0 })]
                })]
              });
            })
          });
        }),
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
          left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" }
        }
      });
    }

    function quizParagraphs(questions, withAnswers) {
      const list = quizQuestions(questions);
      if (!list.length) return [paragraph("Sin preguntas registradas.", { run: { italics: true, color: "5B6573" } })];
      const output = [];
      list.forEach(function (question, questionIndex) {
        output.push(new Paragraph({
          spacing: { before: questionIndex ? 160 : 0, after: 60 },
          children: [run((questionIndex + 1) + ". ", { bold: true }), run(question.q, { bold: true })]
        }));
        question.options.forEach(function (option, optionIndex) {
          const isCorrect = withAnswers && optionIndex === question.answer;
          output.push(new Paragraph({
            spacing: { after: 30, line: 252 },
            indent: { left: 360 },
            children: [
              run(optionLetter(optionIndex) + ". ", { bold: isCorrect, color: isCorrect ? "166534" : "1F2937" }),
              run(option, { bold: isCorrect, color: isCorrect ? "166534" : "1F2937" })
            ]
          }));
        });
        if (withAnswers) {
          output.push(new Paragraph({
            spacing: { before: 50, after: 100 },
            indent: { left: 360 },
            children: [
              run("Respuesta correcta: ", { bold: true, color: "166534", size: 19 }),
              run(optionLetter(question.answer) + ". " + (question.options[question.answer] || ""), { color: "166534", size: 19 }),
              question.why ? run(" — " + question.why, { italics: true, color: "5B6573", size: 19 }) : run("", {})
            ]
          }));
        }
      });
      return output;
    }

    const children = [];

    // Portada
    children.push(new Paragraph({ spacing: { before: 2400, after: 300 }, alignment: AlignmentType.CENTER, children: [run("MATERIAL EDUCATIVO · PENSAMIENTO CRÍTICO", { size: 18, bold: true, color: ACCENT, allCaps: true })] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 220 }, children: [run(title, { size: 52, bold: true, color: ACCENT })] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [run(subtitle, { size: 26, italics: true, color: "5B6573" })] }));
    [
      ["Autoría", md.author || "Por definir"],
      ["Institución", md.institution || "Por definir"],
      ["Área o curso", md.course || "Por definir"],
      ["Fecha", date],
      ["Versión", md.version || "1.0"],
      ["Licencia", md.license || "Uso educativo; indicar la licencia antes de publicar."]
    ].forEach(function (row) {
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [run(row[0] + ": ", { bold: true, size: 20, color: "5B6573" }), run(row[1], { size: 20 })] }));
    });
    children.push(new Paragraph({ spacing: { before: 500 }, alignment: AlignmentType.CENTER, children: [run("Documento elaborado con apoyo de inteligencia artificial y revisión humana. Verifica las citas y referencias antes de publicar.", { size: 16, italics: true, color: "5B6573" })] }));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // Índice
    children.push(heading("Índice", HeadingLevel.HEADING_1));
    children.push(new Paragraph({ spacing: { after: 120 }, children: [run("Para actualizar el índice en Word, pulsa Ctrl+A y luego F9, o usa Referencias > Actualizar tabla.", { size: 17, italics: true, color: "5B6573" })] }));
    children.push(new TableOfContents("Índice", { hyperlink: true, headingStyleRange: "1-3" }));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // Ficha pedagógica
    children.push(heading("Ficha pedagógica", HeadingLevel.HEADING_1));
    children.push(dataTable([
      ["Dato", "Valor"],
      ["Tema", title],
      ["Autoría", md.author || "Por definir"],
      ["Institución", md.institution || "Por definir"],
      ["Área o curso", md.course || "Por definir"],
      ["Fecha", date],
      ["Versión", md.version || "1.0"],
      ["Licencia", md.license || "Uso educativo; indicar la licencia antes de publicar."]
    ], [24, 76]));
    children.push(paragraph(""));
    children.push(heading("Propósito", HeadingLevel.HEADING_2));
    children.push(paragraph("Este material organiza el tema " + title + " en " + levels.length + " niveles de profundidad creciente. Cada nivel combina explicación conceptual, preguntas socráticas, análisis de evidencias, actividad y evaluación formativa para que el estudiante no solo recuerde información, sino que aprenda a interrogarla, contextualizarla y argumentar."));
    children.push(heading("Uso sugerido", HeadingLevel.HEADING_2));
    children.push(paragraph("Puede utilizarse en educación superior o en formación docente. Se recomienda trabajarlo en dos o tres sesiones: activación de conocimientos previos, recorrido por niveles con discusión guiada y cierre metacognitivo con el cuestionario final."));
    children.push(heading("Objetivos de aprendizaje", HeadingLevel.HEADING_2));
    asArray(plan.objectives).forEach(function (objective) { children.push(bullet(objective)); });
    children.push(heading("Activación de conocimientos previos", HeadingLevel.HEADING_2));
    asArray(plan.priorKnowledge).forEach(function (question) { children.push(numbered(question)); });
    children.push(heading("Metodología y evaluación", HeadingLevel.HEADING_2));
    children.push(paragraph("Se propone una metodología de indagación guiada: el estudiante lee, formula preguntas, distingue hechos de interpretaciones, contrasta fuentes y construye una conclusión revisable. La evaluación es formativa y continua; el cuestionario final y la rúbrica del anexo permiten valorar la comprensión y la calidad del razonamiento."));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // Niveles
    levels.forEach(function (level, levelIndex) {
      children.push(heading(level.name || ("Nivel " + (levelIndex + 1)), HeadingLevel.HEADING_1, { pageBreakBefore: levelIndex > 0 }));
      if (level.cognitiveFocus || level.cognitiveDescription) {
        children.push(new Paragraph({
          spacing: { after: 140, line: 252 },
          children: [
            run("Enfoque cognitivo: ", { bold: true, size: 21, color: ACCENT }),
            run((level.cognitiveFocus || "") + (level.cognitiveDescription ? ". " + level.cognitiveDescription : ""), { size: 21, color: "5B6573" })
          ]
        }));
      }
      if (level.introduction) {
        children.push(new Paragraph({
          spacing: { after: 180, line: 276 },
          shading: { fill: "F2F5F9", type: ShadingType.CLEAR, color: "auto" },
          border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
          children: [run(level.introduction, { size: 21 })]
        }));
      }
      if (!asArray(level.citedReferences).length) {
        children.push(new Paragraph({
          spacing: { before: 80, after: 180 },
          shading: { fill: "FFF7ED", type: ShadingType.CLEAR, color: "auto" },
          border: { left: { style: BorderStyle.SINGLE, size: 18, color: "D97706", space: 8 } },
          children: [run("La introducción de este nivel no registra citas verificables. Revisa las fuentes antes de publicar el material.", { size: 18, italics: true, color: "8A4B08" })]
        }));
      }
      asArray(level.entries).forEach(function (entry, entryIndex) {
        children.push(heading(entry.title, HeadingLevel.HEADING_2));
        imageParagraph(entry).forEach(function (item) { children.push(item); });
        const hasCitations = asArray(entry.citedReferences).length > 0;
        if (!hasCitations) {
          children.push(new Paragraph({
            spacing: { before: 80, after: 160 },
            shading: { fill: "FFF7ED", type: ShadingType.CLEAR, color: "auto" },
            border: { left: { style: BorderStyle.SINGLE, size: 18, color: "D97706", space: 8 } },
            children: [run("Esta entrada no registra citas verificables en el texto. Antes de publicarla, revisa las fuentes y añade la cita que corresponda a cada afirmación.", { size: 18, italics: true, color: "8A4B08" })]
          }));
        }
        splitParagraphs(entry.explanation).forEach(function (line) { children.push(paragraph(line)); });
        children.push(heading("Conceptos clave y relaciones", HeadingLevel.HEADING_3));
        asArray(entry.keyConcepts).forEach(function (item) {
          if (!item || typeof item !== "object") { children.push(bullet(item)); return; }
          const term = item.term || item.concept || item.name || item.key || "";
          const meaning = item.meaning || item.definition || item.explanation || item.description || "";
          const relations = item.relations || item.relation || item.relationship || item.connections || "";
          children.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60, line: 264 },
            children: [
              run(term, { bold: true, size: 21 }),
              run(meaning ? ": " + meaning : "", { size: 21 }),
              relations ? run(" Relación: " + relations, { italics: true, size: 19, color: "5B6573" }) : run("", {})
            ]
          }));
        });
        children.push(heading("Pensamiento crítico y evidencias", HeadingLevel.HEADING_3));
        children.push(paragraph(entry.evidenceQuestion));
        children.push(heading("Preguntas socráticas", HeadingLevel.HEADING_3));
        asArray(entry.socraticQuestions).forEach(function (question) { children.push(numbered(question)); });
        children.push(heading("Actividad de aprendizaje", HeadingLevel.HEADING_3));
        children.push(paragraph(entry.activity));
        children.push(heading("Transferencia", HeadingLevel.HEADING_3));
        children.push(paragraph(entry.transfer));
        children.push(heading("Evaluación formativa", HeadingLevel.HEADING_3));
        children.push(new Paragraph({ spacing: { after: 80 }, children: [run(entry.checkQuestion, { bold: true })] }));
        children.push(new Paragraph({
          spacing: { after: 160, line: 264 },
          shading: { fill: "F8FAFC", type: ShadingType.CLEAR, color: "auto" },
          children: [run(entry.feedback, { italics: true, size: 20, color: "5B6573" })]
        }));
        if (asArray(entry.quiz).length) {
          children.push(heading("Comprobación", HeadingLevel.HEADING_3));
          quizParagraphs(entry.quiz, false).forEach(function (item) { children.push(item); });
        }
        if (entryIndex < asArray(level.entries).length - 1) children.push(new Paragraph({ children: [new PageBreak()] }));
      });
    });

    // Cuestionario final
    children.push(heading("Cuestionario final", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    children.push(paragraph("Responde sin consultar las respuestas. Al final del documento encontrarás la clave con la explicación de cada opción correcta."));
    quizParagraphs(finalQuiz, false).forEach(function (item) { children.push(item); });
    children.push(heading("Cierre metacognitivo", HeadingLevel.HEADING_1));
    children.push(paragraph("Reflexiona sobre tu recorrido de aprendizaje:"));
    asArray(plan.metacognition).forEach(function (question) { children.push(numbered(question)); });

    // Referencias
    children.push(heading("Referencias citadas", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    children.push(paragraph("Se incluyen únicamente las fuentes que sostienen afirmaciones del texto. Si una entrada no tiene citas, se advierte en su lugar."));
    if (!cited.length) {
      children.push(paragraph("No se registraron referencias citadas en el texto. Si el material se va a publicar, revisa las fuentes antes de distribuirlo.", { run: { italics: true, color: "8A4B08" } }));
    } else {
      cited.forEach(function (reference, index) {
        const parts = apaParts(reference);
        children.push(new Paragraph({
          spacing: { after: 100, line: 252 },
          indent: { left: 720, hanging: 720 },
          children: [
            run((index + 1) + ". ", { size: 19, bold: true }),
            run(parts.author + ". (" + parts.year + "). ", { size: 19 }),
            run(parts.title + ".", { size: 19, italics: true }),
            parts.url ? run(" " + parts.url, { size: 18, color: "1D4ED8" }) : run("", {})
          ]
        }));
      });
    }

    // Anexos
    children.push(heading("Anexo 1. Clave de respuestas", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    children.push(heading("Cuestionario final", HeadingLevel.HEADING_2));
    quizParagraphs(finalQuiz, true).forEach(function (item) { children.push(item); });
    levels.forEach(function (level, levelIndex) {
      const entryKeys = asArray(level.entries).filter(function (entry) { return asArray(entry.quiz).length; });
      if (!entryKeys.length) return;
      children.push(heading("Nivel " + (levelIndex + 1) + ": " + level.name, HeadingLevel.HEADING_2));
      entryKeys.forEach(function (entry) {
        children.push(heading(entry.title, HeadingLevel.HEADING_3));
        quizParagraphs(entry.quiz, true).forEach(function (item) { children.push(item); });
      });
    });

    children.push(heading("Anexo 2. Rúbrica de evaluación", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    children.push(paragraph("La rúbrica valora la calidad del razonamiento, no solo la cantidad de contenido memorizado."));
    children.push(dataTable([
      ["Criterio", "Inicial", "En desarrollo", "Logrado", "Excelente"],
      ["Comprensión conceptual", "Reconoce términos aislados.", "Explica las ideas principales con apoyo.", "Explica y relaciona con precisión.", "Integra y matiza con explicación propia."],
      ["Análisis crítico", "Describe sin cuestionar.", "Formula preguntas básicas.", "Distingue hechos, interpretaciones e hipótesis.", "Evalúa supuestos, sesgos y límites de la evidencia."],
      ["Uso de evidencias", "No cita o cita sin relación.", "Usa alguna fuente pertinente.", "Contrasta fuentes y justifica su pertinencia.", "Integra evidencias diversas y reconoce incertidumbres."],
      ["Transferencia", "No conecta con otros contextos.", "Conexión superficial.", "Relaciona con un caso o problema real.", "Propone una transferencia fundamentada y original."],
      ["Metacognición", "No reflexiona sobre su proceso.", "Identifica una dificultad.", "Explica estrategias y cambios en sus ideas.", "Planifica cómo seguir aprendiendo y revisar conclusiones."]
    ], [18, 20.5, 20.5, 20.5, 20.5]));

    children.push(heading("Anexo 3. Guía docente", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    children.push(heading("Antes de la sesión", HeadingLevel.HEADING_2));
    ["Revisa las citas y la lista de referencias; verifica que las fuentes existan y sean pertinentes.",
      "Adapta el lenguaje y los ejemplos al grupo. Si el tema es sensible, acuerda reglas de diálogo.",
      "Activa los conocimientos previos con las preguntas de la ficha pedagógica."].forEach(function (item) { children.push(bullet(item)); });
    children.push(heading("Durante la sesión", HeadingLevel.HEADING_2));
    ["Trabaja nivel por nivel; no reveles todas las respuestas de golpe.",
      "Pide a los estudiantes que distingan hecho, interpretación, hipótesis y opinión.",
      "Usa las preguntas socráticas para profundizar y las actividades para aplicar.",
      "Registra las dudas que aparezcan para retomarlas en el cierre."].forEach(function (item) { children.push(bullet(item)); });
    children.push(heading("Después de la sesión", HeadingLevel.HEADING_2));
    ["Aplica el cuestionario final y comenta la clave de respuestas.",
      "Cierra con las preguntas metacognitivas y una transferencia a un caso actual.",
      "Pide una revisión crítica de una de las fuentes citadas."].forEach(function (item) { children.push(bullet(item)); });
    children.push(heading("Evaluación", HeadingLevel.HEADING_2));
    ["Usa la rúbrica del anexo para valorar comprensión, análisis, evidencias, transferencia y metacognición.",
      "Prioriza la calidad del razonamiento sobre la cantidad de contenido memorizado.",
      "Incluye una instancia de autoevaluación y otra de coevaluación."].forEach(function (item) { children.push(bullet(item)); });

    children.push(heading("Anexo 4. Fuentes consultadas", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    children.push(paragraph("Esta lista recoge las fuentes que el modelo declaró haber consultado. No todas se citan en el texto; la sección de referencias citadas es la que sostiene las afirmaciones."));
    if (!consulted.length) {
      children.push(paragraph("No se registraron fuentes consultadas.", { run: { italics: true, color: "5B6573" } }));
    } else {
      consulted.forEach(function (reference, index) {
        const parts = apaParts(reference);
        children.push(new Paragraph({
          spacing: { after: 80, line: 252 },
          indent: { left: 720, hanging: 720 },
          children: [
            run((index + 1) + ". ", { size: 18, bold: true, color: "5B6573" }),
            run(parts.author + ". (" + parts.year + "). " + parts.title + ". " + parts.url, { size: 18, color: "5B6573" })
          ]
        }));
      });
    }

    children.push(heading("Anexo 5. Créditos de imágenes", HeadingLevel.HEADING_1, { pageBreakBefore: true }));
    const credits = [];
    levels.forEach(function (level) {
      asArray(level.entries).forEach(function (entry) {
        if (imageUrlFor(entry)) credits.push(entry.title + ": " + (text(entry.imageCredit) || "Imagen generada con IA para esta entrada."));
      });
    });
    if (!credits.length) children.push(paragraph("No se registraron imágenes.", { run: { italics: true, color: "5B6573" } }));
    credits.forEach(function (credit) { children.push(bullet(credit)); });

    const section = {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720 }
        }
      },
      headers: {
        first: new Header({ children: [new Paragraph("")] }),
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [run(title, { size: 16, color: "5B6573" })]
          })]
        })
      },
      footers: {
        first: new Footer({ children: [new Paragraph("")] }),
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              run("Página ", { size: 16, color: "5B6573" }),
              PageNumber.CURRENT,
              run(" de ", { size: 16, color: "5B6573" }),
              PageNumber.TOTAL_PAGES
            ]
          })]
        })
      },
      children: children
    };

    return new Document({
      creator: md.author || "Generador de Iceberg Pro",
      title: title,
      subject: "Material educativo para el pensamiento crítico",
      description: "Iceberg educativo con niveles de profundidad, actividades, cuestionarios y referencias.",
      keywords: "iceberg educativo, pensamiento crítico, educación superior, " + text(md.course),
      styles: {
        default: {
          document: {
            run: { font: FONT, size: 22, color: "1F2937" },
            paragraph: { spacing: { line: 276 } }
          }
        },
        paragraphStyles: [
          {
            id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 32, bold: true, color: ACCENT, font: FONT },
            paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 }
          },
          {
            id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 26, bold: true, color: ACCENT, font: FONT },
            paragraph: { spacing: { before: 300, after: 140 }, outlineLevel: 1 }
          },
          {
            id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 22, bold: true, color: "0F172A", font: FONT },
            paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 2 }
          }
        ]
      },
      numbering: {
        config: [{
          reference: "iceberg-numbering",
          levels: [{
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }]
        }]
      },
      sections: [section]
    });
  }

  return {
    VERSION: VERSION,
    buildHtml: buildHtml,
    buildDocx: buildDocx,
    formatApaHtml: formatApaHtml,
    formatApaText: formatApaText,
    authorShort: authorShort
  };
});
