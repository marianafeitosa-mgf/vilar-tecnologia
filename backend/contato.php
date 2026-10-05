<?php
/**
 * Vilar Tecnologia - Recebimento do formulário de contato.
 *
 * Como usar: copie este arquivo para a raiz do site (mesma pasta do index.html)
 * e defina formEndpoint: "/contato.php" em assets/js/config.js.
 * Requer hospedagem com PHP 8+ e envio de e-mail habilitado.
 */

declare(strict_types=1);

const DESTINATARIO = 'contato@vilartecnologia.com.br';
const REMETENTE = 'nao-responda@vilartecnologia.com.br';
const INTERVALO_MINIMO_SEGUNDOS = 30;

$assuntosPermitidos = [
    'orcamento' => 'Solicitação de orçamento',
    'duvida'    => 'Dúvida',
    'parceria'  => 'Parceria',
    'outro'     => 'Outro assunto',
];

$querJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function responder(int $status, string $mensagem, bool $json): never
{
    http_response_code($status);
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $status === 200, 'message' => $mensagem], JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Contato</title>'
            . '<p>' . htmlspecialchars($mensagem) . '</p><p><a href="/">Voltar ao site</a></p></html>';
    }
    exit;
}

function campo(string $nome, int $limite): string
{
    $valor = strip_tags(trim((string) ($_POST[$nome] ?? '')));
    // Quebras de linha só são aceitas na mensagem; nos demais campos evitam injeção de cabeçalhos de e-mail.
    if ($nome !== 'mensagem') {
        $valor = str_replace(["\r", "\n"], ' ', $valor);
    }
    return mb_substr($valor, 0, $limite);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, 'Método não permitido.', $querJson);
}

// Campo-armadilha preenchido = robô. Respondemos "sucesso" para não dar pistas.
if (!empty($_POST['website'])) {
    responder(200, 'Mensagem enviada.', $querJson);
}

session_start();
if (time() - ($_SESSION['ultimo_envio'] ?? 0) < INTERVALO_MINIMO_SEGUNDOS) {
    responder(429, 'Aguarde alguns segundos antes de enviar outra mensagem.', $querJson);
}

$nome = campo('nome', 100);
$email = filter_var(campo('email', 150), FILTER_VALIDATE_EMAIL) ?: '';
$telefone = preg_replace('/[^\d()\s-]/', '', campo('telefone', 15));
$empresa = campo('empresa', 100);
$assunto = $assuntosPermitidos[$_POST['assunto'] ?? ''] ?? '';
$mensagem = campo('mensagem', 2000);
$consentimento = ($_POST['consentimento'] ?? '') === 'sim';

$erros = [];
if (mb_strlen($nome) < 3) $erros[] = 'nome';
if ($email === '') $erros[] = 'e-mail';
if ($assunto === '') $erros[] = 'assunto';
if (mb_strlen($mensagem) < 10) $erros[] = 'mensagem';
if (!$consentimento) $erros[] = 'consentimento LGPD';

if ($erros) {
    responder(422, 'Verifique os campos: ' . implode(', ', $erros) . '.', $querJson);
}

$corpo = implode("\n", [
    "Nova mensagem pelo site",
    "------------------------",
    "Nome: {$nome}",
    "E-mail: {$email}",
    "Telefone: " . ($telefone ?: 'não informado'),
    "Empresa: " . ($empresa ?: 'não informada'),
    "Assunto: {$assunto}",
    "",
    "Mensagem:",
    $mensagem,
    "",
    "------------------------",
    "Consentimento LGPD: sim, em " . date('d/m/Y H:i:s'),
]);

$cabecalhos = implode("\r\n", [
    'From: Site Vilar Tecnologia <' . REMETENTE . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
]);

$enviado = mail(DESTINATARIO, '=?UTF-8?B?' . base64_encode("[Site] {$assunto} - {$nome}") . '?=', $corpo, $cabecalhos);

if (!$enviado) {
    responder(500, 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.', $querJson);
}

$_SESSION['ultimo_envio'] = time();
responder(200, 'Mensagem enviada com sucesso! Retornaremos em até 2 dias úteis.', $querJson);
