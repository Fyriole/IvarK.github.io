function getDimensionFinalMultiplier(tier) {
  //if (player.currentEternityChall == "eterc3" && tier > 4) return new Decimal(0)
  var name = TIER_NAMES[tier];

  let multiplier = new Decimal(player[name + 'Pow']);

  if (player.currentChallenge == "postcngm3_2") return player.infinityPower.pow(getInfinityPowerEffectPower()).max(1)
  if (player.currentEternityChall == "eterc11") return player.infinityPower.pow(getInfinityPowerEffectPower()).max(1).times(Decimal.pow(getDimensionBoostPower(), player.resets - tier + 1).max(1))
  if (player.currentChallenge == "challenge7" && !player.galacticSacrifice) {
      if (tier == 4) multiplier = multiplier.pow(1.4)
      if (tier == 2) multiplier = multiplier.pow(1.7)
  }

  multiplier = multiplier.times(player.achPow);
  multiplier = multiplier.times(kongDimMult)
  multiplier = multiplier.times(kongAllDimMult)

  if (player.currentEternityChall != "eterc9") multiplier = multiplier.times(player.infinityPower.pow(getInfinityPowerEffectPower()).max(1))

  if (player.infinityUpgrades.includes("totalMult")) multiplier = multiplier.times(totalMult)
  if (player.infinityUpgrades.includes("currentMult")) multiplier = multiplier.times(currentMult)
  if (player.infinityUpgrades.includes("infinitiedMult")) multiplier = multiplier.times(infinitiedMult)
  if (player.infinityUpgrades.includes("achievementMult")) multiplier = multiplier.times(achievementMult)
  if (player.infinityUpgrades.includes("challengeMult")) multiplier = multiplier.times(challengeMult)

  let timeAndDimMult = timeMult()
  if (hasInfinityMult(tier)) timeAndDimMult = dimMults().times(timeAndDimMult)
  if (!player.challenges.includes("postcngmm_1")&&player.currentChallenge!="postcngmm_1") multiplier = multiplier.times(timeAndDimMult)
  if (tier == 1) {
      if (player.infinityUpgrades.includes("unspentBonus")) multiplier = multiplier.times(unspentBonus);
      if (player.achievements.includes("r28")) multiplier = multiplier.times(1.1);
      if (player.achievements.includes("r31")) multiplier = multiplier.times(1.05);
      if (player.achievements.includes("r71")) multiplier = multiplier.times(player.galacticSacrifice?909:3);
      if (player.achievements.includes("r68")) multiplier = multiplier.times(player.galacticSacrifice?5:1.5);
      if (player.galacticSacrifice) if (player.achievements.includes("r64")) multiplier = multiplier.times(1e6);
  }

  if (tier == 8 && player.achievements.includes("r23")) multiplier = multiplier.times(1.1);
  else if (player.achievements.includes("r34")) multiplier = multiplier.times(player.galacticSacrifice?2:1.02);
  if (tier <= 4 && player.achievements.includes("r43")) multiplier = multiplier.times(1.25);
  if (player.galacticSacrifice&&player.achievements.includes("r31")) multiplier = multiplier.times(productAllTotalBought1());
  if (player.achievements.includes("r48")) multiplier = multiplier.times(1.1);
  if (player.achievements.includes("r72")) multiplier = multiplier.times(player.galacticSacrifice?10:1.1); // tbd
  if (player.galacticSacrifice&&player.achievements.includes("r46")) multiplier = multiplier.times(productAllDims1());
  if (player.achievements.includes("r74") && player.currentChallenge != "") multiplier = multiplier.times(player.galacticSacrifice?40:1.4);
  if (player.achievements.includes("r77")) multiplier = multiplier.times(1+tier/(player.galacticSacrifice?10:100));
  if (!player.galacticSacrifice) {
      if (player.achievements.includes("r56") && player.thisInfinityTime < 1800) multiplier = multiplier.times(3600/(player.thisInfinityTime+1800));
      if (player.achievements.includes("r78") && player.thisInfinityTime < 3) multiplier = multiplier.times(3.3/(player.thisInfinityTime+0.3));
      if (player.achievements.includes("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) multiplier = multiplier.times(Math.max(2400/(player.thisInfinityTime+600), 1))
      if (player.achievements.includes("r91") && player.thisInfinityTime < 50) multiplier = multiplier.times(Math.max(301-player.thisInfinityTime*6, 1))
      if (player.achievements.includes("r92") && player.thisInfinityTime < 600) multiplier = multiplier.times(Math.max(101-player.thisInfinityTime/6, 1));
  }
  if (player.boughtDims&&player.achievements.includes("r98")) multiplier = multiplier.times(player.infinityDimension8.amount.max(1))
  if (player.achievements.includes("r84")) multiplier = multiplier.times(player.money.pow(player.galacticSacrifice?0.00002:0.00004).plus(1));
  else if (player.achievements.includes("r73")) multiplier = multiplier.times(player.money.pow(player.galacticSacrifice?0.00001:0.00002).plus(1));


  if (player.timestudy.studies.includes(71) && tier !== 8) multiplier = multiplier.times(calcTotalSacrificeBoost().pow(0.25).min("1e210000"));
  if (player.timestudy.studies.includes(91)) multiplier = multiplier.times(Decimal.pow(10, Math.min(player.thisEternity, 18000)/60));
  let ndReplMult = 1
  let useHigherNDReplMult = !player.dilation.active ? false : !player.masterystudies ? false : player.masterystudies.includes("t323")
  if (player.timestudy.studies.includes(101)) ndReplMult = player.replicanti.amount.max(1)
  if (!useHigherNDReplMult) multiplier = multiplier.times(ndReplMult)
  if (player.timestudy.studies.includes(161)) multiplier = multiplier.times(new Decimal(player.aarexModifications.newGameExpVersion?"1e3080":"1e616"))
  if (player.timestudy.studies.includes(234) && tier == 1) multiplier = multiplier.times(calcTotalSacrificeBoost())

  multiplier = multiplier.times(player.postC3Reward)
  if (player.challenges.includes("postc8") && tier < 8 && tier > 1) multiplier = multiplier.times(mult18);

  if (isADSCRunning() || (player.galacticSacrifice && player.currentChallenge === "postc1")) multiplier = multiplier.times(productAllTotalBought());
  else {
      if (player.currentChallenge == "postc6" || inQC(6)) multiplier = multiplier.dividedBy(player.matter.max(1))
      if (player.currentChallenge == "postc8" || inQC(6)) multiplier = multiplier.times(player.postC8Mult)
  }

  if (player.currentChallenge == "postc4" && player.postC4Tier != tier) multiplier = multiplier.pow(0.25)
  if (player.challenges.includes("postc4") && player.galacticSacrifice === undefined) multiplier = multiplier.pow(1.05);
  if (player.currentEternityChall == "eterc10") multiplier = multiplier.times(ec10bonus)
  if (player.timestudy.studies.includes(193)) multiplier = multiplier.times(Decimal.pow(1.03, getEternitied()).min("1e13000"))
  if (tier == 8 && player.timestudy.studies.includes(214)) multiplier = multiplier.times((calcTotalSacrificeBoost().pow(8)).min("1e46000").times(calcTotalSacrificeBoost().pow(1.1).min(new Decimal("1e125000"))))
  if (tier == 8 && player.achievements.includes("ng3p27")) multiplier = multiplier.times(Decimal.pow(10,Math.pow(player.galaxies,Math.min(Math.sqrt(Math.log10(Math.max(player.galaxies,1)))*2,2.5))))
	  
  if (player.galacticSacrifice) {
      if (player.galacticSacrifice.upgrades.includes(12)) multiplier = multiplier.times(galUpgrade12())
      if (player.galacticSacrifice.upgrades.includes(13) && player.currentChallenge != "challenge15" && player.currentChallenge != "postc1") multiplier = multiplier.times(galUpgrade13())
      if (player.challenges.includes("postc4")) multiplier = multiplier.pow(1.05);
      if (player.galacticSacrifice.upgrades.includes(31)) multiplier = multiplier.pow(galUpgrade31());
  }

  if (multiplier.lt(1)) multiplier = new Decimal(1)
  if (player.dilation.active || player.galacticSacrifice) {
    multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), dilationPowerStrength()))
    if (player.dilation.upgrades.includes(9)) {
      multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 1.05))
    }
  }

  if (player.dilation.upgrades.includes(6)) multiplier = multiplier.times(player.dilation.dilatedTime.max(1).pow(308))
  if (useHigherNDReplMult) multiplier = multiplier.times(ndReplMult)
  if (player.challenges.includes("postcngmm_1")||player.currentChallenge=="postcngmm_1") multiplier = multiplier.times(timeAndDimMult)
  if (player.galacticSacrifice) {
      if (player.achievements.includes("r56") && player.thisInfinityTime < 1800) multiplier = multiplier.times(3600/(player.thisInfinityTime+1800));
      if (player.achievements.includes("r78") && player.thisInfinityTime < 3) multiplier = multiplier.times(3.3/(player.thisInfinityTime+0.3));
      if (player.achievements.includes("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) multiplier = multiplier.times(Math.max(2400/(player.thisInfinityTime+600), 1))
      if (player.achievements.includes("r91") && player.thisInfinityTime < 50) multiplier = multiplier.times(Math.max(301-player.thisInfinityTime*6, 1))
      if (player.achievements.includes("r92") && player.thisInfinityTime < 600) multiplier = multiplier.times(Math.max(101-player.thisInfinityTime/6, 1));
      if (player.currentChallenge == "postc6" || inQC(6)) multiplier = multiplier.dividedBy(player.matter.max(1))
      if (player.currentChallenge == "postc8" || inQC(6)) multiplier = multiplier.times(player.postC8Mult)
      if (multiplier.lt(1)) multiplier = new Decimal(1)
  }
  if (player.masterystudies != undefined) if (player.dilation.active) multiplier = multiplier.pow(getNanofieldRewardEffect(5))
  return multiplier;
}

function getDimensionDescription(tier) {
  var name = TIER_NAMES[tier];
  if (tier > Math.min(inQC(1) ? 1 : player.currentEternityChall == "eterc3" ? 3 : player.currentChallenge == "challenge4" || player.currentChallenge == "postc1" ? 5 : 7, player.resets + 3) - (player.currentChallenge == "challenge7" || inQC(4) ? 1 : 0)) return getFullExpansion(player.currentChallenge == "challenge11" ? getAmount(tier) : player[name + 'Bought']) + ' (' + dimBought(tier) + ')';
  else return shortenDimensions(player[name + 'Amount']) + ' (' + dimBought(tier) + ')  (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}

function getDimensionRateOfChange(tier) {
  if (tier == 8 || (player.currentEternityChall == "eterc3" && tier > 3)) {
      return 0;
  }

  let toGain = getDimensionProductionPerSecond(tier + 1)
  if (tier == 7 && player.currentEternityChall == "eterc7") toGain = DimensionProduction(1).times(10)

  var name = TIER_NAMES[tier];
  if (player.currentChallenge == "challenge7" || inQC(4)) {
      if (tier == 7) return 0
      else toGain = getDimensionProductionPerSecond(tier + 2);
  }
  var current = player[name + 'Amount'].max(1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(10).dividedBy(current);

  return change;
}

function hasInfinityMult(tier) {
    switch (tier) {
        case 1: case 8: return player.infinityUpgrades.includes("18Mult");
        case 2: case 7: return player.infinityUpgrades.includes("27Mult");
        case 3: case 6: return player.infinityUpgrades.includes("36Mult");
        case 4: case 5: return player.infinityUpgrades.includes("45Mult");
    }
}



    function multiplySameCosts(cost) {
        var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
        var tierCosts = [ null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15) ];
    
        for (let i = 1; i <= 8; ++i) {
            if (player[tiers[i] + "Cost"].e == cost.e) player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(tierCosts[i])
    
        }
        if (player.tickSpeedCost.e == cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
        }
    
    
    function multiplyPC5Costs(cost, tier) {
        var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
    
        if (tier < 5) {
            for (var i = 1; i<9; i++) {
                if (player[tiers[i] + "Cost"].e <= cost.e) {
                    player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i-1])
                    if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].times(10)
                }
            }
        } else {
            for (var i = 1; i<9; i++) {
                if (player[tiers[i] + "Cost"].e >= cost.e) {
                    player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i-1])
                   if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].times(10)
                }
            }
        }
    }
    
    
    function canBuyDimension(tier) {
        if (reachedInfinity()) return false;
        if (tier > player.resets + 4) return false;
        if (tier > 1 && player[TIER_NAMES[tier - 1] + 'Amount'] == 0 && getEternitied() < 30) return false;
        if ((player.currentChallenge == "challenge4" || player.currentChallenge == "postc1") && tier > 6) return false
    
        return true;
    }
    
    function getDimensionPowerMultiplier(nonrandom, focusOn) {
        if (((inQC(5)||inQC(7))&&focusOn!="linear")||(((player.currentChallenge=="challenge13"&&player.tickspeedBoosts==undefined)||player.currentChallenge=="postc1"||player.currentChallenge=="postcngm3_1")&&player.galacticSacrifice!=undefined)) {
            if (player.masterystudies) if (player.masterystudies.includes("t321")) return new Decimal("1e430")
            return 1
        }
        let dimMult = player.tickspeedBoosts==undefined?2:1
        if (player.aarexModifications.newGameExpVersion) dimMult *= 10

        if (player.infinityUpgrades.includes('dimMult')) dimMult *= infUpg12Pow()
        if ((player.currentChallenge == "challenge9" || player.currentChallenge == "postc1")&&!nonrandom) dimMult = Math.pow(10/0.30,Math.random())*0.30
    
        if (player.achievements.includes("r58")) dimMult = player.galacticSacrifice?Math.pow(dimMult,1.0666):dimMult*1.01;
        dimMult += ECTimesCompleted("eterc3") * 0.8
        if (player.galacticSacrifice) if ((player.galacticSacrifice.upgrades.includes(33) && player.currentChallenge != "challenge15" && player.currentChallenge != "postc1") || focusOn == "g33") dimMult *= galUpgrade33();
        if (focusOn == "no-QC5") return dimMult
        if (QCIntensity(5)) dimMult += getQCReward(5)
        if (player.masterystudies) {
			if (player.masterystudies.includes("d12")) dimMult += getNanofieldRewardEffect(8)
			if (focusOn != "linear") dimMult = Decimal.pow(dimMult, getMPTPower())
		}
        return dimMult;
    }

    function infUpg12Pow() {
        if (player.galacticSacrifice) return 1.05 + .0025 * Math.min(Math.max(player.infinitied, 0), 60)
        if (player.aarexModifications.newGameExpVersion) return 1.2
        return 1.1
    }
    
    function clearDimensions(amount) {
        var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
    
        for (i = 1; i <= amount; i++) {
            player[tiers[i] + "Amount"] = new Decimal(0)
        }
    }
    
    
    function getDimensionCostMultiplier(tier) {
    
        var multiplier2 = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
        if (player.currentChallenge == "challenge10") return multiplier2[tier - 1];
        else return player.costMultipliers[tier - 1];
    }
    
    function onBuyDimension(tier) {
        if (!player.break) {
            switch (tier) {
                case 1: giveAchievement("You gotta start somewhere"); break;
                case 2: giveAchievement("100 antimatter is a lot"); break;
                case 3: giveAchievement("Half life 3 confirmed"); break;
                case 4: giveAchievement("L4D: Left 4 Dimensions"); break;
                case 5: giveAchievement("5 Dimension Antimatter Punch"); break;
                case 6: giveAchievement("We couldn't afford 9"); break;
                case 7: giveAchievement("Not a luck related achievement"); break;
                case 8: giveAchievement("90 degrees to infinity"); break;
            }
        }
    
        if (player.eightAmount.round().eq(99)) {
            giveAchievement("The 9th Dimension is a lie");
        }
    
	    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0
	    if (player.currentChallenge == "challenge8" || player.currentChallenge == "postc1") clearDimensions(tier-1)
	    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6" || inQC(6)) && player.matter.equals(0)) player.matter = new Decimal(1)
        player.postC4Tier = tier;
        player.postC8Mult = new Decimal(1)
        if (tier != 8) player.dimlife = false
        if (tier != 1) player.dead = false
        if (player.masterystudies) if (tier > 4) player.old = false
    }
    
	function getAmount(tier) {
		let ret = player[TIER_NAMES[tier]+"Amount"].toNumber()
		if (!break_infinity_js) ret = Math.round(ret)
		return ret
	}
    function dimBought(tier) {
        return player[TIER_NAMES[tier]+"Bought"] % 10;
    }

    function recordBought (name, num) {
        player[name + 'Bought'] += num;
        if (player.galacticSacrifice) player.totalBoughtDims[name] = (player.totalBoughtDims[name] ? player.totalBoughtDims[name] : 0) + num;
    }

	function costIncreaseActive(cost) {
        if (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1" || player.infinityUpgradesRespecced != undefined) return false
        return cost.gte(Number.MAX_VALUE) || player.currentChallenge === 'postcngmm_2';
    }

	function getDimensionCostMultiplierIncrease() {
      if (inQC(7)) return Number.MAX_VALUE
      let ret = player.dimensionMultDecrease;
      if (player.currentChallenge === 'postcngmm_2') {
        ret = Math.pow(ret, .5);
      } else if (player.challenges.includes('postcngmm_2')) {
        ret = Math.pow(ret, .9);
      }
      return ret;
    }

function buyOneDimension(tier) {
	if (!canBuyDimension(tier)) return false
	let name = TIER_NAMES[tier]
	let cost = player[name + 'Cost']
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return false
	getOrSubResource(tier, cost)
	player[name + "Amount"] = player[name + "Amount"].add(1)
	recordBought(name, 1)
	if (dimBought(tier) < 1) {
		player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
		if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
		else if (player.currentChallenge == "challenge5") multiplySameCosts(player[name + 'Cost'])
		else player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
		if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(getDimensionCostMultiplierIncrease())
		floatText(name+"D", "x" + shortenMoney(getDimensionPowerMultiplier(tier)))
	}
	if (tier < 2 && player.firstAmount.gte(1e150)) giveAchievement("There's no point in doing that")
	onBuyDimension(tier)
	return true
}

function buyManyDimension(tier, quick) {
	if (!canBuyDimension(tier)) return false
	let name = TIER_NAMES[tier]
	let toBuy = 10 - dimBought(tier)
	let cost = player[name + 'Cost'].times(toBuy)
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return false
	getOrSubResource(tier, cost)
	player[name + "Amount"] = player[name + "Amount"].add(toBuy)
	recordBought(name, toBuy)
	player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
	if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
	else if (player.currentChallenge == "challenge5") multiplySameCosts(player[name + 'Cost'])
	else player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
	if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(getDimensionCostMultiplierIncrease())
	if (!quick) {
		floatText(name+"D", "x" + shortenMoney(getDimensionPowerMultiplier(tier)))
		onBuyDimension(tier)
	}
	return true
}

var initCost
var costMults
function buyBulkDimension(tier, bulk, auto) {
	if (!canBuyDimension(tier)) return
	let bought = 0
	if (dimBought(tier) > 0) {
		if (!buyManyDimension(tier, true)) return
		bought++
	}
	let name = TIER_NAMES[tier]
	let cost = player[name + 'Cost'].times(10)
	let resource = getOrSubResource(tier)
	if (!cost.lte(resource)) return
	if (player.currentChallenge != "postc5" && player.currentChallenge != "challenge5" && player.currentChallenge != "challenge9" && !costIncreaseActive(player[name + "Cost"])) {
		let mult = getDimensionCostMultiplier(tier)
		let max = Number.POSITIVE_INFINITY
		if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1" && player.infinityUpgradesRespecced == undefined) max = Math.ceil(Decimal.div(Number.MAX_VALUE, cost).log(mult))
		var toBuy = Math.min(Math.min(Math.floor(resource.div(cost).times(mult-1).add(1).log(mult)), bulk-bought), max)
		getOrSubResource(tier, Decimal.pow(mult, toBuy).sub(1).div(mult-1).times(cost))
		player[name + "Amount"] = player[name + "Amount"].add(toBuy*10)
		recordBought(name, toBuy*10)
		player[name + "Pow"] = player[name + "Pow"].times(Decimal.pow(getDimensionPowerMultiplier(tier), toBuy))
		player[name + "Cost"] = player[name + "Cost"].times(Decimal.pow(mult, toBuy))
		if (costIncreaseActive(player[name + "Cost"])) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(getDimensionCostMultiplierIncrease())
		bought += toBuy
	}
	let stopped = false
	let failsafe = 0
	while (!canQuickBuyDim(tier)) {
		stopped = true
		if (!buyManyDimension(tier, true)) break
		bought++
		if (bought == bulk) break
		failsafe++
		if (failsafe > 149) break
		stopped = false
	}
	while (!stopped) {
		stopped = true
		let mi = getDimensionCostMultiplierIncrease()
		let a = Math.log10(mi)/2
		let b = player.costMultipliers[tier-1].log10()-a
		let c = player[name + "Cost"].times(10).log10()-player.money.log10()
		let d = b*b-4*a*c
		if (d < 0) break
		let toBuy = Math.min(Math.floor((-b+Math.sqrt(d))/(2*a))+1,bulk-bought)
		if (toBuy < 1) break
		let newCost = player[name + "Cost"].times(Decimal.pow(player.costMultipliers[tier-1],toBuy-1).times(Decimal.pow(mi,(toBuy-1)*(toBuy-2)/2)))
		let newMult = player.costMultipliers[tier-1].times(Decimal.pow(mi,toBuy-1))
		if (!inQC(1)) {
			if (player.money.gte(newCost)) player.money = player.money.sub(newCost)
			else if (player.dimensionMultDecrease > 3) player.money = new Decimal(0)
		}
		player[name + "Amount"] = player[name + "Amount"].add(toBuy*10)
		recordBought(name, toBuy*10)
		player[name + "Pow"] = player[name + "Pow"].times(Decimal.pow(getDimensionPowerMultiplier(tier), toBuy))
		player[name + "Cost"] = newCost.times(newMult)
		player.costMultipliers[tier-1] = newMult.times(mi)
		bought += toBuy
	}
	if (!auto) floatText(name+"D", "x" + shortenMoney(Decimal.pow(getDimensionPowerMultiplier(tier), bought)))
	onBuyDimension(tier)
}

function canQuickBuyDim(tier) {
	if (player.currentChallenge == "postc5" || player.currentChallenge == "challenge5" || player.currentChallenge == "challenge9") return false
	return player.dimensionMultDecrease <= 3 || player.costMultipliers[tier-1].gt(Number.MAX_SAFE_INTEGER)
}

function getOrSubResource(tier, sub) {
	if (sub == undefined || inQC(1)) {
		if (tier > 2 && (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1")) return player[TIER_NAMES[tier-2] + "Amount"]
		return player.money
	} else {
		if (tier > 2 && (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1")) {
			if (sub.gt(player[TIER_NAMES[tier-2] + "Amount"])) player[TIER_NAMES[tier-2] + "Amount"] = new Decimal(0)
			else player[TIER_NAMES[tier-2] + "Amount"] = player[TIER_NAMES[tier-2] + "Amount"].sub(sub)
		} else if (sub.gt(player.money)) player.money = new Decimal(0)
		else player.money = player.money.sub(sub)
	}
}


document.getElementById("first").onclick = function () {
    buyOneDimension(1);
};

document.getElementById("second").onclick = function () {
    buyOneDimension(2);
};

document.getElementById("third").onclick = function () {
    buyOneDimension(3);
};

document.getElementById("fourth").onclick = function () {
    buyOneDimension(4);
};

document.getElementById("fifth").onclick = function () {
    buyOneDimension(5);
};

document.getElementById("sixth").onclick = function () {
    buyOneDimension(6);
};

document.getElementById("seventh").onclick = function () {
    buyOneDimension(7);
};

document.getElementById("eight").onclick = function () {
    buyOneDimension(8);
};

document.getElementById("firstMax").onclick = function () {
    buyManyDimension(1);
};

document.getElementById("secondMax").onclick = function () {
    buyManyDimension(2);
};

document.getElementById("thirdMax").onclick = function () {
    buyManyDimension(3);
};

document.getElementById("fourthMax").onclick = function () {
    buyManyDimension(4);
};

document.getElementById("fifthMax").onclick = function () {
    buyManyDimension(5);
};

document.getElementById("sixthMax").onclick = function () {
    buyManyDimension(6);
};

document.getElementById("seventhMax").onclick = function () {
    buyManyDimension(7);
};

document.getElementById("eightMax").onclick = function () {
    buyManyDimension(8);
};


function timeMult() {
    var mult = new Decimal(1)
    if (player.infinityUpgrades.includes("timeMult")) mult = mult.times(infUpg11Pow());
    if (player.infinityUpgrades.includes("timeMult2")) mult = mult.times(infUpg13Pow());
    if (player.achievements.includes("r76")) mult = mult.times(Math.pow(player.totalTimePlayed / (600*60*48), player.galacticSacrifice?0.1:0.05));
    return mult;
}

function infUpg11Pow() {
	if (player.galacticSacrifice) return Math.max(Math.pow(player.totalTimePlayed / 864e3, 0.75), 1)
	else return Math.max(Math.pow(player.totalTimePlayed / 1200, 0.15), 1)
}

function infUpg13Pow() {
	if (player.galacticSacrifice) return Math.pow(1 + player.thisInfinityTime / 2400, 1.5)
	else return Math.max(Math.pow(player.thisInfinityTime / 2400, 0.25), 1)
}

function dimMults() {
	return Decimal.pow(1+getInfinitied()*0.2,(player.galacticSacrifice?2:1)*(player.timestudy.studies.includes(31)?4:1))
}

function getInfinitiedMult() {
	return (player.galacticSacrifice?0:1)+Math.pow((player.galacticSacrifice?1:0)+Math.log10(getInfinitied()+1)*(player.galacticSacrifice?100:10),(player.galacticSacrifice?2:1)*(player.timestudy.studies.includes(31)?4:1))
}

function getDimensionProductionPerSecond(tier) {
	let ret = player[TIER_NAMES[tier] + 'Amount'].floor()
	if ((player.currentChallenge == "challenge7" || inQC(4)) && !player.galacticSacrifice) {
		if (tier == 4) ret = ret.pow(1.3)
		else if (tier == 2) ret = ret.pow(1.5)
	}
	ret = ret.times(getDimensionFinalMultiplier(tier))
	if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") ret = ret.times(player.chall2Pow)
	let tick = getTickspeed()
	if (player.dilation.active || player.galacticSacrifice) {
		var maximum = player.galacticSacrifice ? 3 : 0
		tick = Decimal.pow(10, Math.pow(Math.abs(maximum-tick.log10()), dilationPowerStrength()))
		if (player.dilation.upgrades.includes(9)) tick = Decimal.pow(10, Math.pow(Math.abs(maximum-tick.log10()), 1.05))
		if (player.masterystudies != undefined) tick = tick.pow(getNanofieldRewardEffect(5))
		return ret.times(Decimal.pow(10,(player.aarexModifications.newGame3MinusVersion?2:3)-maximum)).times(tick);
	}
	return ret.div(tick.div(1e3));
}
