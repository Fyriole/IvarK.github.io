//infinity dimensions


function DimensionDescription(tier) {
  if (tier > (inQC(4) ? 6 : 7) && (ECTimesCompleted("eterc7") === 0 || player.timeDimension1.amount.eq(0) || tier == 7) && player.currentEternityChall != "eterc7") return getFullExpansion(Math.round(player["infinityDimension"+tier].amount.toNumber()));
  else return shortenDimensions(player['infinityDimension'+tier].amount)+' (+' + formatValue(player.options.notation, DimensionRateOfChange(tier), 2, 2) + dimDescEnd;
}


function DimensionRateOfChange(tier) {
  var toGain = DimensionProduction(tier+(inQC(4)&&tier<8?2:1))
  var current = Decimal.max(player["infinityDimension"+tier].amount, 1);
  if (player.aarexModifications.logRateChange) {
      var change = current.add(toGain.div(10)).log10()-current.log10()
      if (change<0||isNaN(change)) change = 0
  } else var change  = toGain.times(tier>7?1:10).dividedBy(current);
  return change;
}




function updateInfinityDimensions() {
  if (document.getElementById("infinitydimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 8; ++tier) {
        if (!player.infDimensionsUnlocked[tier-1]) {
            break;
        }
        document.getElementById("infD"+tier).textContent = DISPLAY_NAMES[tier] + " Infinity Dimension x" + shortenMoney(DimensionPower(tier));
        document.getElementById("infAmount"+tier).textContent = DimensionDescription(tier);
        document.getElementById("infRow"+tier).style.display = "table-row";
        document.getElementById("infRow"+tier).style.visibility = "visible";
    }
  }
}

function DimensionProduction(tier) {
  if (inQC(8)) return new Decimal(0)
  if (tier == 9) return getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).max(1).minus(1)
  var dim = player["infinityDimension"+tier]
  var ret = dim.amount
  if (inQC(4) && tier == 1) ret = ret.plus(player.infinityDimension2.amount.floor())
  if (player.currentEternityChall == "eterc11") return ret
  if (player.currentEternityChall == "eterc7") ret = ret.dividedBy(player.tickspeed.dividedBy(1000))
  ret = ret.times(DimensionPower(tier))
  if (player.challenges.includes("postc6")&&!inQC(3)) {
      let tick = new Decimal(player.tickspeed)
      if (player.dilation.active || player.galacticSacrifice) {
        tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), dilationPowerStrength()))
        if (player.dilation.upgrades.includes(9)) {
          tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 1.05))
        }
      }
      tick = new Decimal(1).dividedBy(tick)
      return ret.times(tick.times(1000).pow(0.0005))
  }
  else return ret
}

function DimensionPower(tier) {
  var dim = player["infinityDimension"+tier]
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  if (player.currentEternityChall=='eterc14') return getIDReplMult()
  if (inQC(3)) return getExtraDimensionBoostPower()
  var mult = dim.power

  mult = mult.times(infDimPow)

  mult = mult.times(kongAllDimMult)
  if (player.achievements.includes("r94") && tier == 1) mult = mult.times(2);
  if (player.achievements.includes("r75") && !player.boughtDims) mult = mult.times(player.achPow);
  if (player.replicanti.unl && player.replicanti.amount.gt(1)) mult = mult.times(getIDReplMult())

  if (player.timestudy.studies.includes(72) && tier == 4) {
      mult = mult.times(calcTotalSacrificeBoost().pow(0.04).max(1).min("1e30000"))
  }

  if (player.timestudy.studies.includes(82)) {
      mult = mult.times(Decimal.pow(1.0000109,Math.pow(player.resets,2)).min(player.meta==undefined?1/0:'1e80000'))
  }

  if (player.eternityUpgrades.includes(1)) {
      mult = mult.times(player.eternityPoints.plus(1))
  }

  if (player.eternityUpgrades.includes(2)) mult = mult.times(getEU2Mult())

  if (player.eternityUpgrades.includes(3)) mult = mult.times(getEU3Mult())

  if (player.timestudy.studies.includes(92)) mult = mult.times(Decimal.pow(2, 600/Math.max(player.bestEternity, 20)))
  if (player.timestudy.studies.includes(162)) mult = mult.times(player.aarexModifications.newGameExpVersion?1e55:1e11)
  if (ECTimesCompleted("eterc2") !== 0 && tier == 1) mult = mult.times(player.infinityPower.pow(1.5/(700-ECTimesCompleted("eterc2")*100)).min(new Decimal("1e100")).plus(1))
  if (player.currentEternityChall == "eterc2" || player.currentEternityChall == "eterc10" || player.currentEternityChall == "eterc13") mult = mult.times(0)

  if (ECTimesCompleted("eterc4") !== 0) mult = mult.times(player.infinityPoints.pow(0.003 + ECTimesCompleted("eterc4")*0.002).min(new Decimal("1e200")))

  if (ECTimesCompleted("eterc9") !== 0) mult = mult.times(player.timeShards.pow(ECTimesCompleted("eterc9")*0.1).plus(1).min(new Decimal("1e400")))

  if (inQC(6)) mult = mult.times(player.postC8Mult).dividedBy(player.matter.max(1))

  if (mult.lt(0)) mult = new Decimal(0)

  if (player.dilation.active || player.galacticSacrifice) {
    mult = Decimal.pow(10, Math.pow(mult.max(1).log10(), dilationPowerStrength()))
    if (player.dilation.upgrades.includes(9)) {
      mult = Decimal.pow(10, Math.pow(mult.log10(), 1.05))
    }
  }

  return mult
}




function resetInfDimensions() {

  if (player.infDimensionsUnlocked[0]) {
      player.infinityPower = new Decimal(0)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0 && ECTimesCompleted("eterc7") > 0){
      player.infinityDimension8.amount = new Decimal(player.infinityDimension8.baseAmount)
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0){
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[6] && player.infinityDimension6.amount != 0){
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[5] && player.infinityDimension6.amount != 0){
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[4] && player.infinityDimension5.amount != 0){
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[3] && player.infinityDimension4.amount != 0){
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[2] && player.infinityDimension3.amount != 0){
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[1] && player.infinityDimension2.amount != 0){
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }

}

var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [null, 50, 30, 10, 5, 5, 5, 5, 5]

function buyManyInfinityDimension(tier) {
  if (player.eterc8ids <= 0 && player.currentEternityChall == "eterc8") return false
  var dim = player["infinityDimension"+tier]
  if (player.infinityPoints.lt(dim.cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false
  if (player.eterc8ids == 0) return false
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(10);
  if (ECTimesCompleted("eterc12")) {
      dim.cost = Decimal.round(dim.cost.times(Math.pow(infCostMults[tier], 1-ECTimesCompleted("eterc12")*0.008)))
  } else {
      dim.cost = Decimal.round(dim.cost.times(infCostMults[tier]))
  }
  dim.power = dim.power.times(infPowerMults[tier])
  dim.baseAmount += 10

  if (player.currentEternityChall == "eterc8") player.eterc8ids-=1
  document.getElementById("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
  if (inQC(6)) player.postC8Mult = new Decimal(1)
  return true
}

function buyMaxInfDims(tier) {
  var dim = player["infinityDimension"+tier]

  if (player.infinityPoints.lt(dim.cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false

  let costMult;
  if (ECTimesCompleted("eterc12")) {
      costMult = Math.pow(infCostMults[tier], 1-ECTimesCompleted("eterc12")*0.008)
  } else {
      costMult = infCostMults[tier]
  }

  var toBuy = Math.floor((player.infinityPoints.e - dim.cost.e) / Math.log10(costMult))
  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy-1))
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.cost = dim.cost.times(costMult)
  dim.amount = dim.amount.plus(10*toBuy);
  dim.power = dim.power.times(Decimal.pow(infPowerMults[tier], toBuy))
  dim.baseAmount += 10*toBuy
  buyManyInfinityDimension(tier)
}

function getInfinityPowerEffectPower() {
	if (player.galacticSacrifice != undefined) {
		if (player.currentChallenge == "postcngm3_2") return Math.max(player.galaxies, 7)
		if (player.currentChallenge.includes("postcngm3_2")) return Math.max(Math.pow(player.galaxies + (player.resets + player.tickspeedBoosts) / 24, 0.7), 7)
		return Math.max(Math.pow(player.galaxies, 0.7), 7)
	}
	return 7
}

function switchAutoInf(tier) {
  if (player.infDimBuyers[tier-1]) {
      player.infDimBuyers[tier-1] = false
      document.getElementById("infauto"+tier).textContent = "Auto: OFF"
  } else {
      player.infDimBuyers[tier-1] = true
      document.getElementById("infauto"+tier).textContent = "Auto: ON"
  }
  hideMaxIDButton()
}

function toggleAllInfDims() {
  if (player.infDimBuyers[0]) {
      for (var i=1; i<9; i++) {
          player.infDimBuyers[i-1] = false
          document.getElementById("infauto"+i).textContent = "Auto: OFF"
      }
  } else {
      for (var i=1; i<9; i++) {
          if (getEternitied() - 10>=i) {
              player.infDimBuyers[i-1] = true
              document.getElementById("infauto"+i).textContent = "Auto: ON"
          }
      }
  }
  hideMaxIDButton()
}

function loadInfAutoBuyers() {
  for (var i=1; i<9; i++) {
      if (player.infDimBuyers[i-1]) document.getElementById("infauto"+i).textContent = "Auto: ON"
      else document.getElementById("infauto"+i).textContent = "Auto: OFF"
  }
  hideMaxIDButton(true)
}

var infDimPow = 1

function getIDReplMult() {
	if (player.masterystudies) if (player.masterystudies.includes('t311')) return getReplMult().pow(17.3)
	return getReplMult()
}

function getEU2Mult() {
	if (player.boughtDims) return Decimal.pow(getEternitied(), Math.log(getEternitied()*2+1)/Math.log(4))
	var cap = Math.min(getEternitied(), 100000)
	var soft = getEternitied() - cap
	return Decimal.pow(cap/200 + 1, Math.log(cap*2+1)/Math.log(4)).times(new Decimal(soft/200 + 1).times(Math.log(soft*2+1)/Math.log(4)).max(1)).max(player.achievements.includes("ngpp15")?Decimal.pow(10, Math.pow(Math.log10(getEternitied()), 4.75)):1)
}

function getEU3Mult() {
	if (player.boughtDims) return player.timeShards.div(1e12).plus(1)
	return Decimal.pow(2,300/Math.max(infchallengeTimes, player.achievements.includes("r112") ? 6.1 : 7.5))
}