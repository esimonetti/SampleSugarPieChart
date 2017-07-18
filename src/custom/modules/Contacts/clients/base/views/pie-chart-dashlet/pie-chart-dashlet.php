<?php

$viewdefs['Contacts']['base']['view']['pie-chart-dashlet'] = array(
    'dashlets' => array(
        array(
            'label' => 'LBL_DASHLET_PIE_CHART_LABEL',
            'description' => 'LBL_DASHLET_PIE_CHART_DESCRIPTION',
            'config' => array(),
            'preview' => array(),
            'filter' => array(
                'module' => array(
                    'Contacts',
                ),
                'view' => 'record',
            ),
        ),
    ),
);
