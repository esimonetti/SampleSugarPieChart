<?php

// Enrico Simonetti
// enricosimonetti.com
//
// 2017-07-18 on Sugar 7.9.0.0
// filename: custom/modules/Contacts/clients/base/api/CommissionApi.php

class CommissionApi extends SugarApi
{
    public function registerApiRest()
    {
        return array(
            array(
                'reqType' => 'GET',
                'path' => array('Contacts', '?', 'commission'),
                'pathVars' => array('', 'contact_id', ''),
                'method' => 'getCommission',
                'shortHelp' => 'Get commission split for a Contact based on members of the primary Team',
                'longHelp' => '',
            )
        );
    }
    
    public function getCommission($api, $args)
    {
        if(empty($args['contact_id'])) {
            throw new SugarApiExceptionInvalidParameter();
        }

        $record = BeanFactory::getBean('Contacts', $args['contact_id']);
        if(!empty($record->id)) {
            if(!empty($record->team_id)) {
                $team = BeanFactory::getBean('Teams', $record->team_id);
                $users = $team->get_team_members();
            
                $parsed_users = array();
                $return_data = array();
                $total_weight = 0;

                if(!empty($users)) {
                    foreach($users as $user) {
                        if(empty($user->commission_weight_c)) {
                            $weight = 1;       
                        } else {
                            $weight = $user->commission_weight_c;
                        }
                        $parsed_users[$user->id] = array(
                            'weight' => $weight,
                            'name' => $user->full_name,
                        );
                        $total_weight += $weight;
                    }
                
                    foreach($parsed_users as $key => $user) {
                        $return_data[] = array(
                            'key' => $user['name'],
                            'value' => round(100 * $user['weight'] / $total_weight, 2),
                        );
                    }

                    return $return_data;
                }
                
                return array();
            }
        }
        else
        {
            return array();
        }
    }
}
