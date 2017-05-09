<?php

namespace FWV\ManagerBundle\Controller;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ManagerController extends Controller
{
    public function indexAction()
    {
        $manager = $this->container->get('fwv_manager.helper');
        $form = $this->createFormBuilder()
            ->add('tarball', FileType::class, array('required' => true))
            ->getForm();
        return $this->render('FWVManagerBundle:Default:index.html.twig', array(
            'files' => $manager->getSaves(),
            'form' => $form->createView()
        ));
    }

    public function startServerAction(Request $request)
    {
        if (!$request->isXMLHttpRequest()) {
            return new Response('This is not ajax!', 400);
        }

        $manager = $this->container->get('fwv_manager.helper');

        try {

            if ($saveName = $request->get('savename')) {
                if ($manager->isServerRunning()) {
                    $manager->stopServer();
                }
                $manager->startServer($saveName, $this->get('logger'));
            } else {
                if ($manager->isServerRunning()) {
                    return new JsonResponse(array(
                        'done' => false,
                        'answer' => 'Server already started'
                    ));
                }
                $manager->startServer(null, $this->get('logger'));

            }
        } catch (Exception $e) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => $e->getMessage()
            ));
        }
        return new JsonResponse(array(
            'done' => true
        ));
    }

    public function stopServerAction(Request $request)
    {
        if (!$request->isXMLHttpRequest()) {
            return new Response('This is not ajax!', 400);
        }

        $manager = $this->container->get('fwv_manager.helper');
        try {
            if (!$manager->isServerRunning()) {
                return new JsonResponse(array(
                    'done' => false,
                    'answer' => 'Server is not started'
                ));
            }
            $manager->stopServer();
        } catch (Exception $e) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => $e->getMessage()
            ));
        }
        return new JsonResponse(array(
            'done' => true
        ));
    }

    public function restartServerAction(Request $request)
    {
        if (!$request->isXMLHttpRequest()) {
            return new Response('This is not ajax!', 400);
        }

        $manager = $this->container->get('fwv_manager.helper');
        try {
            $manager->restartServer($this->get('logger'));
        } catch (Exception $e) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => $e->getMessage()
            ));
        }
        return new JsonResponse(array(
            'done' => true
        ));
    }

    public function getSavesAction(Request $request)
    {
        if (!$request->isXMLHttpRequest()) {
            return new Response('This is not ajax!', 400);
        }

        $manager = $this->container->get('fwv_manager.helper');
        return new JsonResponse(array(
            'done' => true,
            'saves' => $manager->getSaves()
        ));
    }

    public function createGameAction(Request $request)
    {
        if (!$request->isXMLHttpRequest()) {
            return new Response('This is not ajax!', 400);
        }

        if (!$saveName = $request->get('savename')) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => 'Please, give a name to your save'
            ));
        }

        if ($saveName != preg_replace("/[^A-Za-z0-9 ]/", '', $saveName)) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => 'Only alphanumeric characteres are allowed'
            ));
        }

        $manager = $this->container->get('fwv_manager.helper');
        try {
            $manager->createGame($saveName);
        } catch (Exception $e) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => $e->getMessage()
            ));
        }

        return new JsonResponse(array(
            'done' => true
        ));
    }

    public function isServerOnAction(Request $request)
    {
        if (!$request->isXMLHttpRequest()) {
            return new Response('This is not ajax!', 400);
        }
        $manager = $this->container->get('fwv_manager.helper');
        try {
            $answer = $manager->isServerRunning() ? true : false;
        } catch (Exception $e) {
            return new JsonResponse(array(
                'done' => false,
                'answer' => $e->getMessage()
            ));
        }
        return new JsonResponse(array(
            'done' => true,
            'answer' => $answer
        ));
    }

    public function uploadGameAction(Request $request)
    {
        if($request->getMethod() == 'POST') {
            $form = $this->createFormBuilder()
                ->add('tarball', FileType::class, array('required' => true))
                ->getForm();
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $someNewFilename = 'factorio.tar.xz';

                $form['tarball']->getData()->move('../var', $someNewFilename);

                try {
                    $this->container->get('fwv_manager.helper')->installGame();
                } catch (ProcessFailedException $e) {
                    $this->get('logger')->error($e->getMessage());
                }
            }
            else {
                foreach ($form->getErrors() as $error) {
                    $this->get('logger')->error($error->getMessage());
                }
            }
        }
        return $this->redirect($this->generateUrl('fwv_manager_homepage'));
    }
}
