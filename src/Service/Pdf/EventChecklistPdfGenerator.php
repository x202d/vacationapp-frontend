<?php

namespace App\Service\Pdf;

use Dompdf\Dompdf;
use Dompdf\Options;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

final class EventChecklistPdfGenerator
{
    public function __construct(
        private readonly Environment $twig,
    )
    {
    }

    /**
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws LoaderError
     */
    public function generate(object $event): string
    {
        $html = $this->twig->render(
            'pdf/event_checklist.html.twig',
            [
                'event' => $event,
            ],
        );

        $options = new Options();
        $options->setDefaultFont('DejaVu Sans');
        $options->setIsRemoteEnabled(false);

        $dompdf = new Dompdf($options);

        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }
}